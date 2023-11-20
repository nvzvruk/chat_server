import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
  ) {}

  messageToDto(message: Message) {
    const { user, ...restMessage } = message;

    return {
      ...restMessage,
      sender: {
        id: user.id,
        name: user.name,
      },
    };
  }

  async create(text: string, userId: number) {
    const newMessage = await this.messageRepo.create({
      text,
      user: { id: userId },
    });

    return this.messageRepo.save(newMessage);
  }

  async findOne(id: number) {
    const message = await this.messageRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    return this.messageToDto(message);
  }

  async findAll() {
    const data = await this.messageRepo.find({
      relations: ['user'],
    });

    return data.map(this.messageToDto);
  }
}
