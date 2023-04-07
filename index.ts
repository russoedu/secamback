import { FFmpeg } from './_helpers/FFmpeg'
import { Image } from './_helpers/Image'
import config from './config.json'

const ffmpeg = new FFmpeg(config.servers)
const img = new Image()
/*
 * Check every X seconds (config)
 * Save a tmp image
 * Compare with the previous (save the previous in a cache)
 * If time > 10s || diff > ???
 *    move to storage
 *    force capture the next 10 seconds (we need a flag)
 * Clean the image from the 48 hours before
 */
setInterval(async function () {
  const tmpImages = await ffmpeg.run()
  await img.process(tmpImages[0])
}, config.checkTime)
