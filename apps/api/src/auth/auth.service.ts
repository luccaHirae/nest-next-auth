import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { hash, verify } from 'argon2';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthJwtPayload } from './types/auth.jwt-payload';
import { JwtService } from '@nestjs/jwt';
import refreshConfig from './config/refresh.config';
import { Role } from 'generated/prisma';

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
      role: user.role,
    };
  }

  async signin(id: number, name: string, role: Role) {
    const { accessToken, refreshToken } = await this.generateToken(id);

    const hashedRefreshToken = await hash(refreshToken);
    await this.userService.updateHashedRefreshToken(id, hashedRefreshToken);

    return {
      id,
      name,
      role,
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
      role: user.role,
    };
  }

  async validateRefreshToken(id: number, refreshToken: string) {
    const user = await this.userService.findOne(id);

    if (!user) throw new UnauthorizedException('User not found');
    if (!user.hashedRefreshToken)
      throw new UnauthorizedException('Refresh token not found');

    const refreshTokenMatches = await verify(
      user.hashedRefreshToken,
      refreshToken,
    );

    if (!refreshTokenMatches)
      throw new UnauthorizedException('Invalid refresh token');

    return {
      id: user.id,
    };
  }

  async refreshToken(id: number, name: string) {
    const { accessToken, refreshToken } = await this.generateToken(id);

    const hashedRefreshToken = await hash(refreshToken);
    await this.userService.updateHashedRefreshToken(id, hashedRefreshToken);

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

  async signout(id: number) {
    return await this.userService.updateHashedRefreshToken(id, null);
  }
}
