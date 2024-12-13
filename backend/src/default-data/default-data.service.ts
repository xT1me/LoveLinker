import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class DefaultDataService {
  private readonly logger = new Logger(DefaultDataService.name);

  constructor(private readonly usersService: UsersService) {}

  async createDefaultData(): Promise<void> {
    const existingAdmin = await this.usersService.findByUsername('admin');
    if (existingAdmin) {
      this.logger.log('Администратор уже существует');
      return;
    }

    const password = 'A7x!Kq2*WvP@8nL$Zr5XjF3oYpT&Qm9D';

    const createUserDto: CreateUserDto = {
      username: 'admin',
      email: 'admin@example.com',
      password,
      name: 'Admin',
      lastName: 'Adminov',
      age: 30,
      sex: 'male',
    };

    const adminUser = await this.usersService.create(createUserDto);

    if (adminUser && adminUser._id) {
      await this.usersService.addRole(adminUser._id.toString(), 'ROLE_ADMIN');
      this.logger.log('Администратор с ролью "ROLE_ADMIN" успешно создан');
    } else {
      this.logger.error('Ошибка при создании администратора');
    }
  }
}
