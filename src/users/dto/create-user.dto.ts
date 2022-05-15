import { IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString } from "class-validator"
import { Role } from '@prisma/client'

export default class CreateUserDto {
  
  @IsString()
  name: string

  @IsEmail()
  email: string

  @IsString()
  @IsPhoneNumber('BR')
  phone: string

  @IsString()
  cpf: string

  @IsString()
  password: string

  @IsOptional()
  @IsEnum(Role)
  role: Role
}