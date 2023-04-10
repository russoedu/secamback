class Formatter {
  get formattedDate () {
    const date = new Date()
      .toISOString()
      .replace(/\//g, '.')
      .replace('T', ' ')
      .replace(/:/g, '-')
      .replace('Z', '')

    return date
  }
}

const _ = new Formatter()
export { _ }
