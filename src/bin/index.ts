#!/usr/bin/env node

import { exec } from './cli.js'

exec(process.argv).catch((err) => {
  console.error(err)
})
