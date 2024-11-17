import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards
} from '@nestjs/common'
import { AdminsQueryDto, AdminsService, CreateAdminDto, UpdateAdminDto } from 'app/services/admins'
import { Assert } from 'common'
import { JwtAuthGuard } from './authentications'
import { AdminExistsGuard, AdminUniqueEmailGuard } from './guards'

@Controller('admins')
@UseGuards(JwtAuthGuard)
export class AdminsController {
    constructor(private readonly adminsService: AdminsService) {}

    @Post()
    @UseGuards(AdminUniqueEmailGuard)
    async createAdmin(@Body() createAdminDto: CreateAdminDto, @Req() req: any) {
        Assert.defined(req.user, 'Authentication failed. req.user is null.')

        return await this.adminsService.createAdmin(createAdminDto)
    }

    @Get()
    async findAdmins(@Query() queryDto: AdminsQueryDto) {
        return await this.adminsService.findAdmins(queryDto)
    }

    @Get(':adminId')
    @UseGuards(AdminExistsGuard)
    async getAdmin(@Param('adminId') adminId: string) {
        return await this.adminsService.getAdmin(adminId)
    }

    @Patch(':adminId')
    @UseGuards(AdminExistsGuard)
    async updateAdmin(
        @Param('adminId') adminId: string,
        @Body() updateAdminDto: UpdateAdminDto,
        @Req() req: any
    ) {
        Assert.defined(req.user, 'Authentication failed. req.user is null.')

        return await this.adminsService.updateAdmin(adminId, updateAdminDto)
    }

    @Delete(':adminId')
    @UseGuards(AdminExistsGuard)
    async removeAdmin(@Param('adminId') adminId: string) {
        return await this.adminsService.removeAdmin(adminId)
    }
}
