import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';

interface RequestWithUser extends Request {
  user: {
    id: number;
    name: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signin(@Request() request: RequestWithUser) {
    return this.authService.signin(request.user.id, request.user.name);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() request: RequestWithUser) {
    return {
      message: `This is your profile. User ID: ${request.user.id}`,
    };
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  refreshToken(@Request() request: RequestWithUser) {
    return this.authService.refreshToken(request.user.id, request.user.name);
  }
}
