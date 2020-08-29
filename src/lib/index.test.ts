import assert from 'assert'
import { checkOptions } from './index'

describe('checkOptions', () => {
  describe('input', () => {
    it('File exists', () => {
      assert.doesNotThrow(() => {
        checkOptions({
          input: './examples/sample.svg',
          output: '',
          sizes: [{ width: 24, height: 24 }]
        })
      })
    })

    it('File not exists', () => {
      assert.throws(
        () => {
          checkOptions({
            input: '',
            output: '',
            sizes: [{ width: 24, height: 24 }]
          })
        },
        () => true
      )
    })
  })

  describe('output', () => {
    it('Directory exists', () => {
      const actual = checkOptions({
        input: './examples/sample.svg',
        output: './examples/sample.png',
        sizes: [{ width: 24, height: 24 }]
      })

      assert.strictEqual(actual.output, './examples/sample.png')
    })

    it('Directory not exists', () => {
      const actual = checkOptions({
        input: './examples/sample.svg',
        output: './foobar/test.png',
        sizes: [{ width: 24, height: 24 }]
      })

      assert.strictEqual(actual.output, 'examples/test.png')
    })
  })

  describe('sizes', () => {
    it('Specified', () => {
      const expected = [{ width: 24, height: 24 }]
      const actual = checkOptions({
        input: './examples/sample.svg',
        output: './examples/sample.png',
        sizes: expected
      })

      assert.deepStrictEqual(actual.sizes, expected)
    })

    it('Not specified', () => {
      assert.throws(
        () => {
          const actual = checkOptions({
            input: './examples/sample.svg',
            output: './examples/sample.png',
            sizes: []
          })
        },
        () => true
      )
    })

    it('Remove redundant elements', () => {
      const actual = checkOptions({
        input: './examples/sample.svg',
        output: './examples/sample.png',
        sizes: [
          { width: 24, height: 24 },
          { width: 0, height: 24 },
          { width: 24, height: 24 },
          { width: 48, height: 0 }
        ]
      })
      const expected = [{ width: 24, height: 24 }]

      assert.deepStrictEqual(actual.sizes, expected)
    })
  })
})
