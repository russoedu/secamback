import Jimp from 'jimp'

export type Server = {
  name: string
  rtsp: string
}
export type TmpImage = {
  server: string
  path: string
  name: string
}
export type ConfigT = {
  checkTime: number
  imageDiffComparison: number
  captureStillsAfterChangeDetected: number
  forceStillAfter: number
  storageFolder: string
  servers: Server[]
}

export enum LogLevel {
  NONE,
  ALL,
  ERROR
}

export type CacheT = {
  path: string,
  stillsAfterLastChange: number,
  changeDetected: boolean
  forceStillAfterCount: number,
  lastCaptureImage: Jimp|null
  lastCaptureImagePath: string
}
