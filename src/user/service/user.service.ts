import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { CreateUserDto, UpdateUserDto } from '../user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    const user = await this.repo.create(dto);
    return await this.repo.save(user);
  }

  async update(id: number, dto: UpdateUserDto) {
    return await this.repo.update(id, dto);
  }

  async delete(id: number) {
    return await this.repo.delete(id);
  }

  async findAll() {
    return await this.repo.find();
  }

  async findOne(id: number) {
    return await this.repo.findOne({ where: { id: id } });
  }
}
