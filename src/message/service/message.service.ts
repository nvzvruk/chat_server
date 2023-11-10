import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/user/user.entity';
import { Message } from '../message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
  ) {}

  // TODO Get user from auth
  async create(text: string, user: User) {
    const newMessage = await this.messageRepo.create({
      text,
      user,
    });

    return this.messageRepo.save(newMessage);
  }

  async findAll() {
    return await this.messageRepo.find();
  }
}
