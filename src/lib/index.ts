import fs from 'fs'
import { convert } from './convert'
import { fetchRenderer } from './fetch-renderer'

/** Options of svg2png. */
export type SVG2PNGOptions = {
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
 * Create the PNG file from the SVG file.
 * @param options Options.
 */
export const svg2png = async (options: SVG2PNGOptions) => {
  return convert({
    input: options.input,
    output: options.output,
    width: options.width,
    height: options.height,
    executablePath: await getExecutablePath(options)
  })
}
