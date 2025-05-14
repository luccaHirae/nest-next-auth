import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { verify } from 'argon2';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthJwtPayload } from './types/auth.jwt-payload';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
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
    const { accessToken } = await this.generateToken(id);

    return {
      id,
      name,
      accessToken,
    };
  }

  async generateToken(id: number) {
    const payload: AuthJwtPayload = { sub: id };
    const [accessToken] = await Promise.all([
      this.jwtService.signAsync(payload),
    ]);

    return {
      accessToken,
    };
  }
}
