import * as path from 'path'
import * as fs from 'node:fs/promises'

import { safelyStringifyJSON } from '@/utils/utils'

export const isFileExists = async (path: string): Promise<boolean> => {
  try {
    await fs.access(path)

    return true
  } catch {
    return false
  }
}

export const readFile = async (path: string): Promise<string | null> => {
  if (!path) {
    return null
  }
  try {
    return await fs.readFile(path, {
      encoding: 'utf8',
    })
  } catch (err) {
    console.log('Error when read file', err)

    return null
  }
}

export const saveFile = async (
  folder: string,
  fileName: string,
  data: unknown
) => {
  const dataStr = typeof data === 'string' ? data : safelyStringifyJSON(data)

  try {
    const pathToDir = path.join(process.cwd(), `/${folder}/`)
    const pathToFile = path.join(process.cwd(), `/${folder}/`, fileName)

    const isDirExists = await isFileExists(pathToDir)

    if (!isDirExists) {
      await fs.mkdir(pathToDir)
    }

    await fs.writeFile(pathToFile, dataStr)
  } catch (err) {
    console.log('Error when write file', err)
  }
}
