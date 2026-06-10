import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerAccount(@Body() dto: RegisterDto) {
    return this.authService.registerUser(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK) // Override standard POST 201 response behavior to map to a standardized 200 OK
  async LoginAccount(@Body() dto: LoginDto) {
    return this.authService.loginUser(dto);
  }
}
