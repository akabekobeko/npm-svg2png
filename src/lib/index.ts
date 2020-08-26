import fs from 'fs'
import upath from 'upath'
import { convert, Size } from './convert'
import { fetchRenderer } from './fetch-renderer'

/** Options of svg2png. */
export type SVG2PNGOptions = {
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
  executablePath?: string

  /** Information for downloading and using Chromium. */
  fetcher?: {
    /**
     * Revision of the download Chromium.
     * @see http://omahaproxy.appspot.com/
     */
    revision: string
    /**
     * Path of the directory to download.
     * If not specified, it will be selected in the puppeteer-core directory of `node_moduels`.
     */
    path: string
  }
}

/**
 * Gets the Chromium path for rendering SVG.
 * @param options Options.
 * @returns Path of Chromium.
 * @throws `fetcher` is not specified even though `executablePath` is omitted.
 */
const getExecutablePath = async (options: SVG2PNGOptions) => {
  if (options.executablePath && fs.existsSync(options.executablePath)) {
    return options.executablePath
  }

  if (!options.fetcher) {
    throw new Error(
      '`fetcher` is not specified even though `executablePath` is omitted. Be sure to specify either.'
    )
  }

  return fetchRenderer(options.fetcher.revision, options.fetcher.path)
}

/**
 * Check options.
 * Correct the exception if the required value is invalid, and fix it if it can.
 * @param options Options.
 * @returns Checked options.
 */
export const checkOptions = (options: SVG2PNGOptions): SVG2PNGOptions => {
  const opts = Object.assign({}, options)

  if (!fs.existsSync(opts.input)) {
    throw new Error('The file specified in `input` does not exist.')
  }

  {
    const dir = upath.dirname(opts.output)
    if (!fs.existsSync(dir)) {
      const pngDir = upath.dirname(opts.input)
      opts.output = upath.join(pngDir, upath.basename(opts.output))
    }
  }

  if (opts.sizes.length === 0) {
    throw new Error('No `sizes` is specified.')
  }

  return opts
}

/**
 * Create the PNG file from the SVG file.
 * @param options Options.
 * @returns Path collection of the output PNG files.
 */
export const svg2png = async (options: SVG2PNGOptions): Promise<string[]> => {
  const opts = checkOptions(options)
  return convert({
    input: opts.input,
    output: opts.output,
    sizes: opts.sizes,
    executablePath: await getExecutablePath(opts)
  })
}
