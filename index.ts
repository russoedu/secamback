import { ffmpeg } from './_helpers/ffmpeg'
import { image } from './_helpers/image'
import config from './config.json'

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
  await image.process(tmpImages[0])
}, config.checkTime)
