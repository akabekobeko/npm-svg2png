import assert from 'assert'
import { parseArgv } from './cli'
import { Size } from '../lib/index'

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

    describe('--sizes', () => {
      it('Square', () => {
        const argv = ['', '', '--sizes', '[256]']
        const options = parseArgv(argv)
        const expected: Size[] = [{ width: 256, height: 256 }]
        assert.deepStrictEqual(options.sizes, expected)
      })

      it('Rectangle', () => {
        const argv = ['', '', '--sizes', '[[128,256]]']
        const options = parseArgv(argv)
        const expected: Size[] = [{ width: 128, height: 256 }]
        assert.deepStrictEqual(options.sizes, expected)
      })

      it('Multiple (Square, Rectangle)', () => {
        const argv = ['', '', '--sizes', '[256, [128,256]]']
        const options = parseArgv(argv)
        const expected: Size[] = [
          { width: 256, height: 256 },
          { width: 128, height: 256 }
        ]
        assert.deepStrictEqual(options.sizes, expected)
      })
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
      assert.strictEqual(options.fetcher!.revision, '768962')
    })

    it('--fetcher-path', () => {
      const argv = ['', '', '--fetcher-path', './renderer']
      const options = parseArgv(argv)
      assert.strictEqual(options.fetcher!.path, './renderer')
    })

    it('defaults', () => {
      const argv = ['', '', '', '']
      const options = parseArgv(argv)
      assert.strictEqual(options.input, '')
      assert.strictEqual(options.output, '')
      assert.deepStrictEqual(options.sizes, [])
      assert.strictEqual(options.executablePath, '')
      assert.strictEqual(options.fetcher!.revision, '')
      assert.strictEqual(options.fetcher!.path, '')
    })
  })
})
