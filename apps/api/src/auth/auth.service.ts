import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { verify } from 'argon2';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthJwtPayload } from './types/auth.jwt-payload';
import { JwtService } from '@nestjs/jwt';
import refreshConfig from './config/refresh.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(refreshConfig.KEY)
    private readonly refreshConfig: { secret: string; expiresIn: string },
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const user = await this.userService.findByEmail(createUserDto.email);

    if (user) throw new ConflictException('User already exists');

    return this.userService.create(createUserDto);
  }

  async validateLocalUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) throw new UnauthorizedException('User not found');

    const isPasswordValid = await verify(user.password, password);

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    return {
      id: user.id,
      name: user.name,
    };
  }

  async signin(id: number, name?: string) {
    const { accessToken, refreshToken } = await this.generateToken(id);

    return {
      id,
      name,
      accessToken,
      refreshToken,
    };
  }

  async generateToken(id: number) {
    const payload: AuthJwtPayload = { sub: id };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshConfig),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateJwtUser(id: number) {
    const user = await this.userService.findOne(id);

    if (!user) throw new UnauthorizedException('User not found');

    return {
      id: user.id,
    };
  }

  async validateRefreshToken(id: number) {
    const user = await this.userService.findOne(id);

    if (!user) throw new UnauthorizedException('User not found');

    return {
      id: user.id,
    };
  }

  async refreshToken(id: number, name: string) {
    const { accessToken, refreshToken } = await this.generateToken(id);

    return {
      id,
      name,
      accessToken,
      refreshToken,
    };
  }

  async validateGoogleUser(googleUser: CreateUserDto) {
    const user = await this.userService.findByEmail(googleUser.email);

    if (user) return user;

    return await this.userService.create(googleUser);
  }
}
