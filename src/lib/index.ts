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
  /** Display the process reports, default is disable. */
  report: boolean
  /**
   * If use Chromium installed, specify the path of the executable file.
   * If this is specified, `fetcher` will be ignored.
   */
  executablePath: string

  /** Information for downloading and using Chromium. */
  fetcher: {
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
