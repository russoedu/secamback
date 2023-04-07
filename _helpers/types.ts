export type Server = {
  name: string
  rtsp: string
}
export type TmpImage = {
  server: string
  path: string
}
export type Config = {
  checkTime: number
  maxTime: number
  captureTimeAfterChange: number
  imageDiffComparison: number
  storageFolder: string
  servers: Server[]
}

export enum LogLevel {
  NONE,
  ALL,
  ERROR
}
