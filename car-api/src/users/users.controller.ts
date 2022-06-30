import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { SerializeInterceptor } from '../interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';

@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('signup')
  createUser(@Body() body: CreateUserDto): Promise<User> {
    return this.usersService.create(body.email, body.password);
  }

  @UseInterceptors(new SerializeInterceptor(UserDto))
  @Get(':id')
  findUser(@Param('id') id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Get()
  findAllUsers(@Query('email') email: string): Promise<User[]> {
    return this.usersService.find(email);
  }

  @Delete(':id')
  removeUser(@Param('id') id: number): Promise<User> {
    return this.usersService.remove(id);
  }

  @Patch(':id')
  updateUser(@Param('id') id: number, @Body() body: UpdateUserDto) {
    return this.usersService.update(id, body);
  }
}
