import { Injectable, NotFoundException } from '@nestjs/common';
import CreateUserDto from '../dto/create-user.dto';
import UpdateUserDto from '../dto/update-user.dto';
import { PrismaService } from 'src/database/prisma.service';
import { Role } from '@prisma/client';
const bcrypt = require('bcrypt')

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number, perPage: number) {
    const users = await this.prisma.user.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        createdUsers: {
          include: {
            createdBy: true
          }
        }
      }
    })
    const totalCount = await this.prisma.user.count()

    return {
      page,
      perPage,
      totalPages: Math.ceil(totalCount / perPage),
      totalCount,
      users,
    }
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        cpf: true,
        role: true,
        active: true,
        password: true,
      }
    })
    if (!user) throw new NotFoundException(`User with id ${id} wasn't found.`)
    return user
  }

  async createOne(user: CreateUserDto, userId: number) {
    user.password = await bcrypt.hash(user.password, await bcrypt.genSalt())
    const newUser = await this.prisma.user.create({ data: user, })

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        createdUsersCount: { increment: 1 },
      }
    })

    await this.prisma.createdUser.create({
      data: { createdById: userId, userId: newUser.id }
    })

    return this.prisma.user.findUnique({
      where: { id: newUser.id },
      include: { createdUsers: { include: { createdBy: true } } }
    })
  }

  async updateOne(id: number, user: UpdateUserDto) {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, await bcrypt.genSalt())
    } else {
      delete user.password
    }
    return this.prisma.user.update({ where: { id }, data: user })
  }

  async updateActive(id: number, active: number) {
    await this.prisma.user.update({ where: { id }, data: { active } })
  }

  async updateRole(id: number, role: Role) {
    await this.prisma.user.update({ where: { id }, data: { role } })
  }

  async deleteOne(id: number) {
    await this.prisma.user.delete({ where: { id } })
  }
}
