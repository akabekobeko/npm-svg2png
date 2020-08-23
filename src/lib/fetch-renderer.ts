import fs from 'fs'
import util from 'util'
import puppeteer from 'puppeteer-core'

const statAsync = util.promisify(fs.stat)

/**
 * Check that path is a valid folder.
 * @param path Path of the download folder.
 * @returns `true` if enabled
 */
const isValidDownloadPath = async (path: string): Promise<boolean> => {
  if (!path) {
    return false
  }

  try {
    const info = await statAsync(path)
    return info.isDirectory()
  } catch (err) {
    return false
  }
}

/**
 * Download Chromium for rendering SVG.
 * @param revision Revision of the download Chromium.
 * @param path Path of the directory to download. If not specified, it will be selected in the puppeteer-core directory of `node_moduels`.
 * @returns Path of the downloaded Chromium.
 */
export const fetchRenderer = async (
  revision: string,
  path: string
): Promise<string> => {
  const downloadPath = isValidDownloadPath(path) ? path : undefined
  const fetcher = puppeteer.createBrowserFetcher({ path: downloadPath })
  if (!fetcher.canDownload(revision)) {
    throw new Error('The specified `revision` cannot be download.')
  }

  const info = await fetcher.download(revision)
  return info.executablePath
}
