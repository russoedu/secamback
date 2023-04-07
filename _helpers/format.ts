class Formatter {
  get formattedDate () {
    const date = new Date()
      .toISOString()
      .replace(/\//g, '.')
      .replace(/[T|Z]/g, '')
      .replace(/:/g, '-')

    return date
  }
}

const _ = new Formatter()
export { _ }
