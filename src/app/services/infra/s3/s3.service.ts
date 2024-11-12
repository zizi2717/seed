import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { S3 } from 'aws-sdk'
import { s3Options } from 'config'

@Injectable()
export class S3Service {
    private s3: S3

    constructor() {
        this.s3 = new S3({
            endpoint: s3Options.endpoint,
            region: s3Options.region,
            credentials: {
                accessKeyId: s3Options.accessKeyId,
                secretAccessKey: s3Options.secretAccessKey
            }
        })
    }

    async saveFile(file: Buffer, key: string | undefined) {
        if (!key) {
            throw new InternalServerErrorException('Key for uploading files is required.')
        }

        try {
            const uploadParams: S3.PutObjectRequest = {
                Bucket: s3Options.bucket,
                Key: `${key}`,
                Body: file,
                ACL: 'public-read'
            }

            return await this.s3.upload(uploadParams).promise()
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
    }

    async removeFile(key: string | undefined) {
        if (!key) {
            throw new InternalServerErrorException('Key for deleting files is required.')
        }

        try {
            const deleteParams: S3.DeleteObjectRequest = {
                Bucket: s3Options.bucket,
                Key: key
            }

            await this.s3.deleteObject(deleteParams).promise()
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
    }
}
