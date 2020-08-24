import commander from 'commander'
import { svg2png, SVG2PNGOptions } from '../lib/index'

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
      '--width <Number>',
      'Width (px) of the output PNG file.',
      parseInt,
      256
    )
    .option(
      '--height <Number>',
      'Height (px) of the output PNG file.',
      parseInt,
      256
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
  $ svg2png -i sample.svg -o sample.png --width 256 --height 256 --executable-path "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  $ svg2png -i sample.svg -o sample.png --width 256 --height 256 --executable-path "C:\\Program Files (x86)\\Google\\Chrome\\Application\\Chrome.exe"
  $ svg2png -i sample.svg -o sample.png --width 256 --height 256 --fetcher-revision 768962 --fetcher-path ./renderer

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
    width: opts.width,
    height: opts.height,
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
