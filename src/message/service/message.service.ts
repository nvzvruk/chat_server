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

  async findPaginated({ pageNumber, pageSize }) {
    const skipCount = (pageNumber - 1) * pageSize;

    const data = await this.messageRepo.find({
      skip: pageNumber === 1 ? 0 : skipCount,
      take: pageSize,
      relations: ['user'],
      order: {
        createdAt: 'DESC',
      },
    });

    const totalCount = await this.messageRepo.count();

    return {
      totalCount,
      hasNext: totalCount - skipCount > pageSize,
      messages: data.reverse().map(this.messageToDto),
    };
  }
}
