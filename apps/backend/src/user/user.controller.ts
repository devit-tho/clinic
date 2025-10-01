import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import {
  ChangePasswordDto,
  CreateUserDto,
  PermissionDto,
  ResetPasswordDto,
} from './user.dto';
import type { Request } from 'express';
import { UsePublic } from 'src/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { GetUser } from 'src/decorators';
import { UserWithoutPassword } from '@repo/entities';

@Controller('user')
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

  @Get(':id/permission')
  async getPermission(@Param('id') id: string) {
    return this.userService.getPermission(id);
  }

  @Patch(':userId/permission/:id')
  async updatePermission(
    @Param('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: PermissionDto,
  ) {
    return this.userService.updatePermission(userId, id, dto);
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
