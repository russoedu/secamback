import { ffmpeg } from './_helpers/ffmpeg'
import { file } from './_helpers/file'
import { image } from './_helpers/image'

try {
  file.prepare()

  // setInterval(async function () {
  async function run () {
    while (true) {
      const tmpImages = await ffmpeg.run()
      await image.process(tmpImages)

      // Clean after time

      // Create movie after time ?

    // await sleep(config.checkTime / config.servers.length)
    }
  // }, config.checkTime)
  }

  run()
} catch (error: any) {
  console.error(error.message)
  process.exit()
}
