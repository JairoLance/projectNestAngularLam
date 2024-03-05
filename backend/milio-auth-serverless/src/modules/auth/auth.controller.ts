import { Controller, Body, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { UserDto } from '../users/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    // return await this.authService.login(req.user);

    try {
      // Autenticación exitosa
      return await this.authService.login(req.user);
    } catch (error) {
      // Error durante la autenticación
      return { result: false, error: 'Credenciales inválidas' };
    }
  }
 
  @Post('signup')
  async signUp(@Body() user: UserDto) {
    return await this.authService.create(user);
  }
}
