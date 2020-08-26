import { svg2png } from '@akabeko/svg2png'

svg2png({
  input: './sample.svg',
  output: './sample.png',
  sizes: [
    { width: 256, height: 256 },
    { width: 128, height: 256 }
  ],
  //executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  fetcher: {
    revision: '782078',
    path: './renderer'
  }
})
  .then((results) => {
    console.log(results)
    console.log('Completed!!!')
  })
  .catch((err) => {
    console.log(err)
  })
