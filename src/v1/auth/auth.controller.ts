import { Body, Controller, Post, Request, Response } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { JWTService } from 'src/common/services/jwt.service';
import { Request as RequestEx, Response as ResponseEx } from 'express';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JWTService,
  ) {}

  @Public()
  @Post('/register')
  async register(@Body() body: RegisterDTO) {
    return await this.authService.register(body);
  }

  @Public()
  @Post('/login')
  async login(@Body() body: LoginDTO, @Response() response: ResponseEx) {
    const accessToken = await this.authService.login(body, response);
    response.status(200).json({
      accessToken: accessToken,
    });
  }

  @Public()
  @Post('/refresh-token')
  async refreshToken(@Request() request: RequestEx) {
    return await this.authService.refreshToken(request);
  }
}
