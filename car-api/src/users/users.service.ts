import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  create(email: string, password: string): Promise<User> {
    const user = this.repository.create({ email, password });

    return this.repository.save(user);
  }

  findOne(id: number): Promise<User | null> {
    if (!id) {
      return null;
    }
    return this.repository.findOne({
      where: {
        id: id,
      },
    });
  }

  find(email: string): Promise<User[]> {
    return this.repository.find({
      where: {
        email: email,
      },
    });
  }

  async update(id: number, attrs: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, attrs);

    return this.repository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.repository.remove(user);
  }
}
