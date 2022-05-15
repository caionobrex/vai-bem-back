import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import CreateUserDto from 'src/users/dto/create-user.dto';
import bcrypt = require('bcrypt')
import { PrismaService } from 'src/database/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (await bcrypt.compare(password, user.password) && user.active) {
      return user
    }

    return null
  }

  async register(userData: CreateUserDto) {
    let user: User = await this.prisma.user.findUnique({
      where: { email: userData.email }
    })
    if (user) throw new BadRequestException('Email already in use')

    userData.password = await bcrypt.hash(userData.password, await bcrypt.genSalt())
    user = await this.prisma.user.create({ data: userData })

    return {
      statusCode: 200,
      message: 'User registered successfully',
      access_token: this.jwtService.sign({ id: user.id, email: user.email  }),
    }
  }
}
