import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import CreateUserDto from 'src/users/dto/create-user.dto';
import { AuthService } from '../providers/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  register(@Body() user: CreateUserDto) {
    return this.authService.register(user)
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Request() req) {
    return {
      statusCode: 200,
      message: 'User authenticated successfully',
      access_token: this.jwtService.sign({
        id: req.user.id,
        email: req.user.email,
        username: req.user.name,
        role: req.user.role 
      }),
    }
  }
}
