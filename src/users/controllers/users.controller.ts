import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role, User } from '@prisma/client';
import { Request as ExpressRequest } from 'express';
import { Roles } from 'src/auth/decorators/roles.decoratos';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import CreateUserDto from '../dto/create-user.dto';
import UpdateUserDto from '../dto/update-user.dto';
import { UsersService } from '../providers/users.service';
const bcrypt = require('bcrypt')

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('/')
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(20), ParseIntPipe) perPage: number,
  ) {
    return this.usersService.findAll(page, perPage)
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async findMe(@Request() req: ExpressRequest & { user: User }) {
    const user = await this.usersService.findOne(req.user.id)
    if (user.active) return user
    throw new NotFoundException('User not found')
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/')
  createOne(
    @Request() req: ExpressRequest & { user: User },
    @Body() user: CreateUserDto
  ) {
    return this.usersService.createOne(user, req.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() userData: UpdateUserDto,
    @Request() req: ExpressRequest & { user: User },
  ) {
    if (req.user.role === Role.USER && req.user.id === id) {
      delete userData.role
      !userData.password && delete userData.password
      const user = await this.usersService.findOne(req.user.id)
      if (userData.currentPassword && !await bcrypt.compare(userData.currentPassword, user.password))
      throw new BadRequestException('Current password is wrong')
    }
    delete userData.currentPassword
    return this.usersService.updateOne(id, userData) 
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('/:id/active')
  async updateActive(
    @Param('id', ParseIntPipe) id: number,
    @Body('active', ParseIntPipe) active: number
  ) {
    if (active < 0 || active > 1) throw new BadRequestException('active field must be 0 | 1')  
    await this.usersService.updateActive(id, active)
    return {
      statusCode: 200,
      message: 'User updated successfully'
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('/:id/role')
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body('role') role: Role
  ) {
    await this.usersService.updateRole(id, role)
    return {
      statusCode: 200,
      message: 'User updated successfully'
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete('/:id')
  deleteOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteOne(id)
  }
}
