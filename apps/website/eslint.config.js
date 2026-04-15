import path from 'node:path'
import { includeIgnoreFile } from '@repo/config-eslint/gitignore.js'
import config from '@repo/config-eslint/astro.js'

const gitignorePath = path.resolve(import.meta.dirname, '.gitignore')

export default [includeIgnoreFile(gitignorePath), ...config]
