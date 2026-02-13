import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Cria o primeiro usuário do sistema (e empresa padrão).
  // Só funciona se ainda não existir nenhum usuário.
  @Post('first')
  createFirstUser(@Body() dto: CreateUserDto) {
    return this.usersService.createFirstUser(dto);
  }
}

