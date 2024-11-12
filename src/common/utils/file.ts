import * as fs from 'fs/promises'
import { Path } from './path'

export class FileHandler {
    private static readonly uploadDir = ''

    static async save(fileBuffer: Buffer, key: string | undefined): Promise<string> {
        if (!key) {
            throw new Error('Key for uploading files is required.')
        }

        try {
            const filePath = Path.join(this.uploadDir, key)

            await fs.mkdir(Path.dirname(filePath), { recursive: true })
            await fs.writeFile(filePath, fileBuffer)

            const fileUrl = ''

            return fileUrl
        } catch (error) {
            throw new Error(`Failed to save file: ${error.message}`)
        }
    }

    static async remove(key: string): Promise<void> {
        try {
            const filePath = Path.join(this.uploadDir, key)

            await fs.unlink(filePath)
        } catch (error) {
            throw new Error(`Failed to delete file: ${error.message}`)
        }
    }
}
