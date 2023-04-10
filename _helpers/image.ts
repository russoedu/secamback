import Jimp, { diff, read } from 'jimp'
import { Cache } from './Cache'
import { file } from './file'
import { TmpImage } from './types'
import { config } from './config'

class Image {
  cache: { [server: string]: Cache } = {}

  constructor () {
    config.servers.forEach(server => {
      this.cache[server.name] = new Cache(server)
    })
  }

  async process (images: TmpImage[]) {
    await Promise.all(images.map(image => this.#process(image)))
  }

  async #process (image: TmpImage) {
    const cache = this.cache[image.server]
    const jimpImage = await read(image.path)

    if (cache.lastCaptureImage) {
      const changed = this.#changeDetected(jimpImage, cache.lastCaptureImage)
      if (changed) {
        this.#wasChangedNow(cache, image, jimpImage)
      } else if (cache.changeDetected) {
        this.#wasChangedBefore(cache, image, jimpImage)
      } else {
        this.#noChange(cache, image, jimpImage)
      }
    } else {
      // First capture is always performed
      this.#moveAndUpdateLast(cache, image, jimpImage)
    }
  }

  /**
   * Executes the updates in the files and cache when a change was detected.
   *
   * - Stores the still in the final folder
   * - sets `changeDetected` to true
   * - resets `stillsAfterLastChange` count
   * - resets `forceStillAfterCount` count
   * @param cache The server cache
   * @param image The current captured image path
   * @param jimpImage The current captured image
   */
  #wasChangedNow (cache: Cache, image: TmpImage, jimpImage: Jimp) {
    this.#moveAndUpdateLast(cache, image, jimpImage)
    cache.changeDetected = true
    cache.stillsAfterLastChange = 0
    cache.forceStillAfterCount = 0
  }

  /**
   * Executes the updates in the files and cache when a change was detected before, but not now (`changeDetected` is true).
   *
   * - Stores the still in the final folder
   * - increases `stillsAfterLastChange` count
   * - resets `forceStillAfterCount` count
   *
   * Finally, checks if `stillsAfterLastChange` reached `captureStillsAfterChangeDetected` from the config and if true:
   * - sets `changeDetected` to false
   * - resets `stillsAfterLastChange` count
   * @param cache The server cache
   * @param image The current captured image path
   * @param jimpImage The current captured image
   */
  #wasChangedBefore (cache: Cache, image: TmpImage, jimpImage: Jimp) {
    this.#moveAndUpdateLast(cache, image, jimpImage)
    cache.stillsAfterLastChange++
    cache.forceStillAfterCount = 0

    if (cache.stillsAfterLastChange >= config.captureStillsAfterChangeDetected) {
      cache.changeDetected = false
      cache.stillsAfterLastChange = 0
    }
  }

  /**
   * Executes the updates in the files and cache when a change was not detected and `changeDetected` is false.
   *
   * - increases `forceStillAfterCount` count
   *
   * Then checks if `forceStillAfterCount` reached `forceStillAfter` from the config and if true:
   * - Stores the still in the final folder
   * - resets `forceStillAfterCount` count
   *
   * If false
   * - Deletes the still in the temporary folder
   * @param cache The server cache
   * @param image The current captured image path
   * @param jimpImage The current captured image
   */
  #noChange (cache: Cache, image: TmpImage, jimpImage: Jimp) {
    cache.forceStillAfterCount++

    if (cache.forceStillAfterCount >= config.forceStillAfter) {
      // Force count reached the max. Store the still and reset
      this.#moveAndUpdateLast(cache, image, jimpImage)
      cache.forceStillAfterCount = 0
    } else {
      // Force count not reached max, just delete the temporary image
      file.delete(image.path)
    }
  }

  /**
   * Moves the temp file to the final destination and updates the cache
   * @param cache The server cache data
   * @param image The temporary image data
   * @param jimpImage The last captured Jimp image
   */
  #moveAndUpdateLast (cache: Cache, image: TmpImage, jimpImage: Jimp) {
    const tempPath = image.path
    const finalPath = `${cache.path}/${image.name}`

    cache.updateLast(image, jimpImage)
    file.move(tempPath, finalPath)
  }

  /**
   * Compares two images for their differences
   * @param lastImage The last captured image
   * @param currentImage The current image
   * @returns True if the difference between the two images is bigger than the configured value
   */
  #changeDetected (lastImage: Jimp, currentImage: Jimp) {
    const difference = diff(lastImage, currentImage)

    return difference.percent > config.imageDiffComparison
  }
}

const image = new Image()
export { image }
