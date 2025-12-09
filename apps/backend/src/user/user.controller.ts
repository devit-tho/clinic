import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { Role, UserWithoutPassword } from '@repo/entities';
import type { Request } from 'express';
import { GetUser } from 'src/common/decorators';
import { UsePublic } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/guards/role.guard';
import {
  ChangePasswordDto,
  CreateUserDto,
  PermissionDto,
  ResetPasswordDto,
} from './user.dto';
import { UserService } from './user.service';

@Controller('user')
@Roles(Role.ADMIN)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll() {
    return this.userService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.userService.getById(id);
  }

  @Get(':id/permissions')
  async getPermissions(@Param('id') id: string) {
    return this.userService.getPermissions(id);
  }

  @Post(':userId/permissions')
  async updatePermissions(
    @Param('userId') userId: string,
    @Body() dto: PermissionDto,
  ) {
    return this.userService.updatePermissions(userId, dto);
  }

  @Post()
  @UsePublic()
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Delete(':id')
  async delete(@GetUser() user: UserWithoutPassword, @Param('id') id: string) {
    return this.userService.deleteUser(user, id);
  }

  @Put(':id/reset-password')
  async resetPassword(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: ResetPasswordDto,
  ) {
    return this.userService.resetPassword(req, id, dto);
  }

  @Put('change-password')
  async changePassword(
    @GetUser() user: UserWithoutPassword,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(user, dto);
  }
}
