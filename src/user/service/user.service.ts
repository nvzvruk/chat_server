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

  async create(userData: CreateUserDto) {
    const createdUser = await this.userRepo.create(userData);
    return await this.userRepo.save(createdUser);
  }

  async update(id: User['id'], userData: UpdateUserDto) {
    await this.userRepo.update(id, userData);
    return await this.userRepo.findOneBy({ id });
  }

  async delete(id: User['id']) {
    await this.userRepo.delete(id);
  }

  async findAll() {
    return await this.userRepo.find();
  }

  async findOne(id: User['id']) {
    return await this.userRepo.findOneBy({ id });
  }

  async findByUsername(username: string) {
    return await this.userRepo.findOneBy({ name: username });
  }

  async updateRefreshToken(id: User['id'], token: string) {
    await this.userRepo.update(id, { refreshToken: token });
  }
}
