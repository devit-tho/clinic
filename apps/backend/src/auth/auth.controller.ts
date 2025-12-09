import { Body, Controller, Delete, Get, Post, Put, Req } from '@nestjs/common';
import { UserWithoutPassword } from '@repo/entities';
import type { Request } from 'express';
import { GetUser } from 'src/common/decorators';
import { UsePublic } from 'src/common/guards/jwt-auth.guard';
import { LoginUserDto, UpdateUserDto } from 'src/user/user.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  @UsePublic()
  async login(@Body() dto: LoginUserDto) {
    return this.userService.login(dto);
  }

  @Delete('logout')
  async logout(@Req() req: Request) {
    return this.userService.logout(req.user.id, req.token);
  }

  @Get('current-user')
  async getCurrentUser(@Req() req: Request) {
    return req.user;
  }

  @Put('current-user')
  async updateCurrentUser(
    @GetUser() user: UserWithoutPassword,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.updateCurrentUser(user, dto);
  }
}
