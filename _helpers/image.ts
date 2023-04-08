import { copyFileSync, mkdirSync, rmSync } from 'fs'
import Jimp, { read, diff } from 'jimp'
import config from '../config.json'
import { CacheT, TmpImage } from './types'

class Image {
  cache: { [server: string]: CacheT } = {}

  constructor () {
    config.servers.forEach(server => {
      const path = `${config.storageFolder}/${server.name}`
      this.cache[server.name] = {
        path,
        stillsAfterLastChange: 0,
        changeDetected:        false,
        forceStillAfterCount:  0,
        lastCaptureImage:      null,
        lastCaptureImagePath:  '',
      }
      // Create folders if they don't exist
      try {
        mkdirSync(path)
      } catch (error: any) {
        if (error.code !== 'EEXIST') throw error
      }
    })
  }

  async process (images: TmpImage[]) {
    const imagesData = await Promise.all(images.map(image => this.#process(image)))

    console.log(imagesData)

    // console.log(`distance       ${Jimp.distance(edinburgh_original, edinburgh_sharpened)}`);

    // console.log(`diff.percent   ${Jimp.diff(edinburgh_original, edinburgh_sharpened).percent}\n`);
  }

  async #process (image: TmpImage) {
    const cache = this.cache[image.server]
    const jimpImage = await read(image.path)

    if (cache.lastCaptureImage) {
      const changed = this.#changeDetected(jimpImage, cache.lastCaptureImage)
      if (changed) {
        // Change was detected. Store the still, set `changeDetected` to true and reset the counts
        this.#moveAndCache(cache, image, jimpImage)
        cache.changeDetected = true
        cache.stillsAfterLastChange = 0
        cache.forceStillAfterCount = 0
      } else if (cache.changeDetected) {
        // Change was not detected now, but `changeDetected` is active. Store the still and check if it's the last one to set `changeDetected` back to false
        this.#moveAndCache(cache, image, jimpImage)
        cache.stillsAfterLastChange++
        if (cache.stillsAfterLastChange >= config.captureStillsAfterChangeDetected) {
          cache.changeDetected = false
          cache.stillsAfterLastChange = 0
        }
      } else {
        // Change was not detected and `changeDetected` is not active. Increase the force count
        cache.forceStillAfterCount++

        if (cache.forceStillAfterCount >= config.forceStillAfter) {
          // Force count reached the max. Store the still and reset
          this.#moveAndCache(cache, image, jimpImage)
          cache.forceStillAfterCount = 0
        } else {
          // Force count not reached max, just delete the temporary image
          rmSync(image.path)
        }
      }
    } else {
      // First capture is always performed
      this.#moveAndCache(cache, image, jimpImage)

      cache.forceStillAfterCount++
    }
  }

  /**
   * Moves the temp file to the final destination and stored its data in the cache
   * @param cache The server cache data
   * @param image The temporary image data
   * @param jimpImage The last captured Jimp image
   */
  #moveAndCache (cache: CacheT, image: TmpImage, jimpImage: Jimp) {
    const tempPath = image.path
    const finalPath = `${cache.path}/${image.name}`

    cache.lastCaptureImage = jimpImage
    cache.lastCaptureImagePath = finalPath

    this.#moveFile(tempPath, finalPath)
  }

  #changeDetected (lastImage: Jimp, currentImage: Jimp) {
    const difference = diff(lastImage, currentImage)

    return difference.percent > config.imageDiffComparison
  }

  /**
   * Moves the file from the origin to the destiny. As we are not sure if the file is stored in another drive, we copy and delete instead of moving.
   * @param origin The file path
   * @param destination The file path destination
   */
  #moveFile (origin: string, destination: string) {
    copyFileSync(origin, destination)
    rmSync(origin)
  }
}

const image = new Image()
export { image }
