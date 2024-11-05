import { Module } from '@nestjs/common'
import { EmailService } from './email'

@Module({
    providers: [EmailService],
    exports: [EmailService]
})
export class InfraModule {}
