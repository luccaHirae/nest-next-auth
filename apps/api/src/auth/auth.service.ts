import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  signup(createUserDto: CreateUserDto) {
    console.log('Creating user:', createUserDto);
    throw new Error('Method not implemented.');
  }
}
