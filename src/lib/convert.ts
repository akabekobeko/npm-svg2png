import fs from 'fs'
import util from 'util'
import puppeteer from 'puppeteer-core'

const readFileAsync = util.promisify(fs.readFile)

/** Options of SVG converter. */
export type ConvertOptions = {
  /** Path of the input SVG file. */
  input: string
  /** Path of the output PNG file. */
  output: string
  /** Width (px) of the output PNG file. */
  width: number
  /** Height (px) of the output PNG file. */
  height: number
  /**
   * If use Chromium installed, specify the path of the executable file.
   * If this is specified, `fetcher` will be ignored.
   */
  executablePath: string
}

/**
 * Create a HTML form the SVG file.
 * @param filePath Path of the SVG file.
 * @returns HTML.
 */
const createHTML = async (filePath: string): Promise<string> => {
  const svg = await readFileAsync(filePath, 'utf8')
  return `<!DOCTYPE html><style>html, body { margin: 0; padding: 0; } svg { position: absolute; top: 0; left: 0; }</style>${svg}`
}

/**
 * Convert the SVG to PNG.
 * @param options Options.
 */
export const convert = async (options: ConvertOptions): Promise<void> => {
  const browser = await puppeteer.launch({
    executablePath: options.executablePath,
    defaultViewport: {
      width: options.width,
      height: options.height
    }
  })

  const page = await browser.newPage()

  try {
    await page.setContent(await createHTML(options.input))

    // Explicitly fix the size of SVG tags.
    // see: https://github.com/neocotic/convert-svg/blob/master/packages/convert-svg-core/src/Converter.js
    await page.evaluate(
      ({ width, height }) => {
        const elm = document.querySelector('svg')
        if (!elm) {
          return
        }

        if (typeof width === 'number') {
          elm.setAttribute('width', `${width}px`)
        } else {
          elm.removeAttribute('width')
        }

        if (typeof height === 'number') {
          elm.setAttribute('height', `${height}px`)
        } else {
          elm.removeAttribute('height')
        }
      },
      {
        width: options.width,
        height: options.height
      }
    )

    await page.screenshot({ path: options.output })

    await page.close()
    await browser.close()
  } catch (error) {
    await page.close()
    await browser.close()
    throw error
  }
}
