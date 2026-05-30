import { Body, Controller, Get, Post, Version } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { UserOtpDto } from './dto/user-otp.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("login/otp")
  @Version('1')
  async generateLoginSignupOtp(@Body() userOtpDto: UserOtpDto) {
    return this.usersService.handleLoginSignupOtp(userOtpDto);
  }

  @Get("verify/otp")
  @Version('1')
  async verifyOtp(@Body() userOtpDto: UserOtpDto) {
    return this.usersService.verifyOtp(userOtpDto);
  }

  @Post("register")
  @Version('1')
  create(@Body() createUserDto: UserDto) {
    return this.usersService.create(createUserDto);
  }
}
