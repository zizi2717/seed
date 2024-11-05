import { Injectable, Logger } from '@nestjs/common'
import { emailOptions } from 'config'
import { createHmac } from 'crypto'

@Injectable()
export class EmailService {
    private readonly accessKey: string
    private readonly secretAccessKey: string
    private readonly apiEndPoint: string

    constructor() {
        this.accessKey = emailOptions.accessKey
        this.secretAccessKey = emailOptions.secretAccessKey
        this.apiEndPoint = 'https://email.com'
    }

    async sendEmailWithTemplate(to: string, parameters: object, templateId: string) {
        const timestamp = Date.now().toString()

        const signature = this.makeSignature('POST', '/api/v1/mails', timestamp)
        
        // TODO: Add header, data, ...

        try {
            const response = await fetch(`${this.apiEndPoint}/mails`, {})

            if (!response.ok) {
                const errorData = await response.text()

                Logger.error('Failed to mailing', errorData)

                throw new Error(`Failed with status ${response.status}`)
            }
        } catch (error) {
            throw error
        }
    }

    private makeSignature(method: string, uri: string, timestamp: string): string {
        const space = ' '
        const newLine = '\n'

        const message = [method, space, uri, newLine, timestamp, newLine, this.accessKey].join('')

        const hmac = createHmac('sha256', this.secretAccessKey)
        const signature = hmac.update(message).digest('base64')

        return signature
    }
}
