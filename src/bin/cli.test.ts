import assert from 'assert'
import { parseArgv } from './cli'

describe('cli', () => {
  describe('parseArgv', () => {
    it('-i', () => {
      const argv = ['', '', '-i', 'sample.svg']
      const options = parseArgv(argv)
      assert.strictEqual(options.input, 'sample.svg')
    })

    it('--input', () => {
      const argv = ['', '', '--input', 'sample.svg']
      const options = parseArgv(argv)
      assert.strictEqual(options.input, 'sample.svg')
    })

    it('-o', () => {
      const argv = ['', '', '-o', 'sample.png']
      const options = parseArgv(argv)
      assert.strictEqual(options.output, 'sample.png')
    })

    it('--output', () => {
      const argv = ['', '', '--output', 'sample.png']
      const options = parseArgv(argv)
      assert.strictEqual(options.output, 'sample.png')
    })

    it('--width', () => {
      const argv = ['', '', '--width', '256']
      const options = parseArgv(argv)
      assert.strictEqual(options.width, 256)
    })

    it('--height', () => {
      const argv = ['', '', '--height', '256']
      const options = parseArgv(argv)
      assert.strictEqual(options.height, 256)
    })

    it('--executable-path', () => {
      const argv = [
        '',
        '',
        '--executable-path',
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      ]
      const options = parseArgv(argv)
      assert.strictEqual(
        options.executablePath,
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      )
    })

    it('--fetcher-revision', () => {
      const argv = ['', '', '--fetcher-revision', '768962']
      const options = parseArgv(argv)
      assert.strictEqual(options.fetcher.revision, '768962')
    })

    it('--fetcher-path', () => {
      const argv = ['', '', '--fetcher-path', './chrome']
      const options = parseArgv(argv)
      assert.strictEqual(options.fetcher.path, './chrome')
    })

    it('defaults', () => {
      const argv = ['', '', '', '']
      const options = parseArgv(argv)
      assert.strictEqual(options.input, '')
      assert.strictEqual(options.output, '')
      assert.strictEqual(options.width, 0)
      assert.strictEqual(options.height, 0)
      assert.strictEqual(options.executablePath, '')
      assert.strictEqual(options.fetcher.revision, '')
      assert.strictEqual(options.fetcher.path, '')
    })
  })
})
