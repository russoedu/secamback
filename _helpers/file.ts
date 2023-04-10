import { copyFileSync, mkdirSync, readdirSync, rmSync, unlinkSync } from 'fs'
import { config } from './config'

class File {
  prepare () {
    // Clean temporary folder
    const tmp = './.tmp'
    try {
      mkdirSync(tmp)
    } catch (error: any) {
      if (error.code !== 'EEXIST') throw error
      const stills = readdirSync('./.tmp')
      stills.forEach(still => {
        unlinkSync(`${tmp}/${still}`)
      })
    }

    // Create folders if they don't exist
    config.servers.forEach(server => {
      const path = `${config.storageFolder}/${server.name}`
      try {
        mkdirSync(path)
      } catch (error: any) {
        if (error.code !== 'EEXIST') throw error
      }
    })
  }

  /**
   * Moves the file from the origin to the destination.
   *
   * As we are not sure if the file is stored in another drive, we copy and delete instead of moving.
   * @param origin The file path we want to move **from**
   * @param destination The file path destination we want to move **to**
   */
  move (origin: string, destination: string) {
    const cleanDestination = destination.replace(/•-•-•-•.+?•-•-•-•/, '')
    copyFileSync(origin, cleanDestination)
    rmSync(origin)
  }

  /**
   * Deletes a file from disk
   * @param path The path of the file to be deleted
   */
  delete (path: string) {
    unlinkSync(path)
  }
}

const file = new File()
export { file }
