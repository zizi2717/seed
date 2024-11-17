import { IsOptional, IsString } from 'class-validator'

export class UpdateAdminDto {
    @IsOptional()
    @IsString()
    name?: string
}
