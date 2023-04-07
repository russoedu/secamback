import Jimp, { read } from 'jimp'
import config from '../config.json'
import { TmpImage } from './types'

class Image {
  cache: {
    [server: string]: {
      path: string,
      stillsAfterChangeDetectedCount: number,
      changeDetected: boolean
      forceAfterChecksCount: number,
      lastCaptureImage: Jimp|null
      lastCaptureImagePath: string
    }
  }

  constructor () {
    config.servers.forEach(server => {
      this.cache[server.name] = {
        path:                           `${config.storageFolder}/${server.name}`,
        stillsAfterChangeDetectedCount: 0,
        changeDetected:                 false,
        forceAfterChecksCount:          0,
        lastCaptureImage:               null,
        lastCaptureImagePath:           'null',
      }
    })
  }

  /*
   * if changeDetected
   *    Store image
   *    stillsAfterChangeDetectedCount ++
   *    if stillsAfterChangeDetectedCount === captureStillsAfterChangeDetected
   *      stillsAfterChangeDetectedCount = 0
   *      changeDetected = false
   * if is in the forceAfterChecks frame
   *    Store image
   *    forceAfterChecksCount = 0
   * else
   *    forceAfterChecksCount ++
   * if Jimp.diff(lastCaptureImage, image).percent > imageDiffComparison
   *    if changeDetected
   *      stillsAfterChangeDetectedCount = 0
   *    else
   *      changeDetected = true
   *      Store image
   * delete last tmp image
   * update lastCaptureImage and lastCaptureImagePath
   */
  async process (image: TmpImage) {
    const data = await read(image.path)
    console.log(this.cache)

    console.log(data)
    // console.log(`distance       ${Jimp.distance(edinburgh_original, edinburgh_sharpened)}`);

    // console.log(`diff.percent   ${Jimp.diff(edinburgh_original, edinburgh_sharpened).percent}\n`);
  }
}

const image = new Image()
export { image }
