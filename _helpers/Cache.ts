import Jimp from 'jimp'
import { Server, TmpImage } from './types'
import { config } from './config'

export class Cache {
  path: string
  stillsAfterLastChange: number
  changeDetected: boolean
  forceStillAfterCount: number
  lastCaptureImage: Jimp|null
  lastCaptureImagePath: string

  constructor (server: Server) {
    this.path = `${config.storageFolder}/${server.name}`
    this.stillsAfterLastChange = 0
    this.changeDetected = false
    this.forceStillAfterCount = 0
    this.lastCaptureImage = null
    this.lastCaptureImagePath = ''
  }

  /**
   * Updates the last captured image
   * @param image The temporary image data of the last captured image
   * @param jimpImage The last captured Jimp image
   */
  updateLast (image: TmpImage, jimpImage: Jimp) {
    const finalPath = `${this.path}/${image.name}`

    this.lastCaptureImage = jimpImage
    this.lastCaptureImagePath = finalPath
  }
}
