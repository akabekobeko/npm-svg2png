import commander from 'commander'
import { svg2png, SVG2PNGOptions, Size } from '../lib/index'

/**
 * Parses the value of the array specified in `sizes` into `Size`.
 * @param value Value of `sizes`.
 * @returns `Size` on success. Otherwise `undefined`.
 */
const parseSizeValue = (value: any): Size | undefined => {
  if (typeof value === 'number') {
    return { width: value, height: value }
  }

  if (Array.isArray(value)) {
    if (value.length === 1) {
      const width = parseInt(value[0])
      return { width, height: width }
    }

    if (1 < value.length) {
      return { width: parseInt(value[0]), height: parseInt(value[1]) }
    }
  }
}

/**
 * Parse `sizes` to create `Size[]`.
 * @param arg The argument specified with the `sizes` in CLI option.
 */
const parseSizes = (arg: string): Size[] => {
  const obj = JSON.parse(arg)
  if (!Array.isArray(obj)) {
    return []
  }

  const sizes: Size[] = []
  for (const value of obj) {
    const size = parseSizeValue(value)
    if (size) {
      sizes.push(size)
    }
  }

  return sizes
}

/**
 * Parse the arguments of command line interface.
 * @param argv Arguments of command line interface.
 * @returns Parsed options.
 */
export const parseArgv = (argv: string[]): SVG2PNGOptions => {
  const program = new commander.Command()
  program
    .usage('svg2png [options]')
    .description(
      'Create PNG file from SVG file with puppeteer-core. Use the specified revision or installed Chromium for PNG file creation.'
    )
    .option('-i, --input <String>', 'Path of the input SVG file.', '')
    .option('-o, --output <String>', 'Path of the output PNG file.', '')
    .option(
      '--sizes <Size[]>',
      'Sizes array of the output PNG file. Specify one element for the array if it is a square, and specify [width,height] for a rectangle. e.g. [256,[256,128],...]',
      parseSizes
    )
    .option(
      '--executable-path <String>',
      'If use Chromium installed, specify the path of the executable file. If this is specified, `--fetcher-*` will be ignored.',
      ''
    )
    .option(
      '--fetcher-revision <String>',
      'Revision of the download Chromium. see: http://omahaproxy.appspot.com/',
      ''
    )
    .option(
      '--fetcher-path <String>',
      'Path of the directory to download. If not specified, it will be selected in the puppeteer-core directory of `node_moduels`.',
      ''
    )
    .version(require('../../package.json').version, '-v, --version')

  program.on('--help', () => {
    console.log(`
Examples:
  $ svg2png -i sample.svg -o sample.png --sizes [256] --executable-path "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  $ svg2png -i sample.svg -o sample.png --sizes [[24,32],256] --executable-path "C:\\Program Files (x86)\\Google\\Chrome\\Application\\Chrome.exe"
  $ svg2png -i sample.svg -o sample.png --sizes [256] --fetcher-revision 782078 --fetcher-path ./renderer

See also:
  https://github.com/akabekobeko/npm-svg2png`)
  })

  // Print help and exit if there are no arguments
  if (argv.length < 3) {
    program.help()
  }

  try {
    program.parse(argv)
  } catch (err) {
    throw err
  }

  const opts = program.opts()
  return {
    input: opts.input,
    output: opts.output,
    sizes: opts.sizes || [],
    executablePath: opts.executablePath,
    fetcher: {
      revision: opts.fetcherRevision,
      path: opts.fetcherPath
    }
  }
}

/**
 * Run the tool based on command line arguments.
 * @param argv Arguments of command line interface.
 * @returns Path of generated files.
 */
export const exec = (argv: string[]) => {
  return svg2png(parseArgv(argv))
}
