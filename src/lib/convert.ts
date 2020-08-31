import fs from 'fs'
import util from 'util'
import upath from 'upath'
import puppeteer, { Page } from 'puppeteer-core'

const readFileAsync = util.promisify(fs.readFile)

/** Size of PNG file. */
export type Size = {
  /** Width (px). */
  width: number
  /** Height (px). */
  height: number
}

/** Options of SVG converter. */
export type ConvertOptions = {
  /** Path of the input SVG file. */
  input: string
  /** Path of the output PNG file. */
  output: string
  /** Sizes of the output PNG files. */
  sizes: Size[]
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
 * Create the PNG file with the specified size.
 * @param page Page instance with SVG loaded.
 * @param size Size of the PNG image (px).
 * @param filePath Path of the output PNG file.
 */
const createPNG = async (page: Page, size: Size, filePath: string) => {
  await page.setViewport({ width: size.width, height: size.height })

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
      width: size.width,
      height: size.height
    }
  )

  await page.screenshot({ path: filePath, omitBackground: true })
}

/**
 * Create the output PNG file path based on the size specification.
 * @param dir Path of the parent directory.
 * @param name Name of the PNG file.
 * @param ext File extention of the PNG file (User specified).
 * @param size Size of the PNG image.
 * @returns If width and height of the size specification are equal (square), it is a path with a file name such as `sample-32.png`, otherwise `sample.32x48.png`.
 */
const createFilePath = (
  dir: string,
  name: string,
  ext: string,
  size: Size
): string => {
  const fileName =
    size.width === size.height
      ? `${name}-${size.width}${ext}`
      : `${name}-${size.width}x${size.height}${ext}`

  return upath.join(dir, fileName)
}

/**
 * Convert the SVG to the PNG.
 * @param options Options.
 * @returns Path collection of the output PNG files.
 */
export const convert = async (options: ConvertOptions): Promise<string[]> => {
  const browser = await puppeteer.launch({
    executablePath: options.executablePath
  })

  const page = await browser.newPage()
  const results: string[] = []

  try {
    await page.setContent(await createHTML(options.input))
    if (options.sizes.length === 1) {
      await createPNG(page, options.sizes[0], options.output)
      results.push(options.output)
    } else {
      const dir = upath.dirname(options.output)
      const ext = upath.extname(options.output)
      const name = upath.basename(options.output, ext)

      for (const size of options.sizes) {
        const filePath = createFilePath(dir, name, ext, size)
        await createPNG(page, size, filePath)
        results.push(filePath)
      }
    }

    return results
  } catch (error) {
    throw error
  } finally {
    await browser.close()
  }
}
