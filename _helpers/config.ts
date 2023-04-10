import { readFileSync, writeFileSync } from 'fs'
import { ConfigT, Server } from './types'
import yaml from 'js-yaml'

class Config {
  #checkTime: number
  #forceStillAfter: number
  #captureStillsAfterChangeDetected: number
  #imageDiffComparison: number
  #storageFolder: string
  #servers: Server[]
  #initialised = false

  #init () {
    if (!this.#initialised) {
      try {
        const configFile = readFileSync('./config.yml', 'utf8')
        const data = yaml.load(configFile) as ConfigT

        this.#checkTime = data.checkTime
        this.#imageDiffComparison = data.imageDiffComparison
        this.#captureStillsAfterChangeDetected = data.captureStillsAfterChangeDetected
        this.#forceStillAfter = data.forceStillAfter
        this.#storageFolder = data.storageFolder
        this.#servers = data.servers

        this.#initialised = true
      } catch (error) {
        writeFileSync('./config.yml', configTemplate)

        throw new Error(`
## ERROR ##
  No config file was detected.

  A new config file (config.yml) with the default values was created. Please make sure to include the list of servers.

`)
      }
    }
  }

  get checkTime () {
    this.#init()

    return this.#checkTime
  }

  get imageDiffComparison () {
    this.#init()

    return this.#imageDiffComparison
  }

  get captureStillsAfterChangeDetected () {
    this.#init()

    return this.#captureStillsAfterChangeDetected
  }

  get forceStillAfter () {
    this.#init()

    return this.#forceStillAfter
  }

  get storageFolder () {
    this.#init()

    return this.#storageFolder
  }

  get servers () {
    this.#init()

    return this.#servers
  }
}

const configTemplate = `#########################################
# This app captures stills ina temporary
# folder but only backs up the ones
# specified in the config
#########################################

# The time between each still is captured
checkTime: 1000
# The difference between two stills that
# will trigger a "change"
imageDiffComparison: 0.2

# How many stills will be captured after
# a "change" is detected
captureStillsAfterChangeDetected: 3

# If no change is detected, a still will
# be backed up after this amount of
# stills
forceStillAfter: 240

# Where the final images will be backed up
storageFolder: G:/My Drive/Imagens/secamback

# List of servers (cameras). The name is
# used to create a folder for each server
servers:
- name: Hall Camera
  rtsp: rtsp://username135:password135@192.168.1.135/live0
- name: Living Room Camera
  rtsp: rtsp://username134:password134@192.168.1.134/live0
- name: Bedroom Camera
  rtsp: rtsp://username136:password136@192.168.1.136/live0
`
const config = new Config()
export { config }
