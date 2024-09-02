import { IsOptional, IsString } from 'class-validator'
import { PaginationOptions } from 'common'

export class UsersQueryDto extends PaginationOptions {
    @IsOptional()
    @IsString()
    email?: string
}
