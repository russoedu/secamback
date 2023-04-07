import { exec } from 'child_process'
import { TmpImage, LogLevel, Server } from './types'
import { _ } from './format'

export class FFmpeg {
  #servers: Server[]
  #defaultCommand = [
    '-rtsp_transport tcp',
    '-loglevel quiet',
    '-r 4 ',
    '-f image2',
    '-vframes 1',
  ].join(' ')

  /**
   * Encapsulates the execution of FFmpeg to download still images in the temporary folder of all RTSP servers in parallel
   * @param servers The list of RTSP servers
   */
  constructor (servers: Server[]) {
    this.#servers = servers
  }

  /**
   * Saves a still image from all servers in the temporary folder
   * @returns An array with the path of the files saved in the temporary folder for each RTSP server
   */
  run () {
    return Promise
      .all(this.#servers.map(server => this.#ffmpeg(server)))
  }

  /**
   * Executes the FFmpeg command to download a still image from the RTSP server and save in the storageFolder defined in the config file
   * @param server The RTSP server to be used
   * @param log The log level to be used
   * @returns The path of the file saved in the temporary folder
   */
  #ffmpeg (server: Server, log?: LogLevel): Promise<TmpImage> {
    return new Promise((resolve) => {
      const path = `./.tmp/${server.name}-${_.formattedDate}.jpg`
      const command = `ffmpeg -i ${server.rtsp} ${this.#defaultCommand} "${path}"`

      exec(command, (error, stdout) => {
        if (log === LogLevel.ALL) {
          if (error) console.log(error)
          if (stdout) console.log(stdout)
        } else if (log === LogLevel.ERROR) {
          if (error) console.log(error)
        }
        resolve({
          server: server.name,
          path,
        })
      })
    })
  }
}
