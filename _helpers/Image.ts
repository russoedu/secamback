import Jimp, { read } from 'jimp'
import { TmpImage } from './types'

export class Image {
  cache: {
    [server: string]: {
      path: string,
      stillsAfterChangeDetectedCount: number,
      changeDetected: boolean
      forceAfterChecksCount: number,
      lastCaptureImage: Jimp
    }
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
   */
  async process (image: TmpImage) {
    const data = await read(image.path)
    console.log(this.cache)

    console.log(data)
    // console.log(`distance       ${Jimp.distance(edinburgh_original, edinburgh_sharpened)}`);

    // console.log(`diff.percent   ${Jimp.diff(edinburgh_original, edinburgh_sharpened).percent}\n`);
  }
}
