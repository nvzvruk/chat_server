import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { CreateUserDto, UpdateUserDto } from '../user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(user: CreateUserDto) {
    const createdUser = await this.userRepo.create(user);
    return await this.userRepo.save(createdUser);
  }

  async update(id: number, user: UpdateUserDto) {
    await this.userRepo.update(id, user);
    return this.userRepo.findBy({ id });
  }

  async delete(id: number) {
    await this.userRepo.delete(id);
  }

  async findAll() {
    return await this.userRepo.find();
  }

  async findOne(id: number) {
    return await this.userRepo.findOneBy({ id });
  }

  async findByUsername(username: string) {
    return await this.userRepo.findOneBy({ name: username });
  }
}
