import { Injectable } from '@nestjs/common';
import { MessagesRepository } from './messages.repository';

@Injectable()
export class MessageService {
  constructor(public messageRepository: MessagesRepository) {}

  finOne(id: string): Promise<any> {
    return this.messageRepository.finOne(id);
  }

  findAll(): Promise<any> {
    return this.messageRepository.findAll();
  }

  create(content: string): Promise<void> {
    return this.messageRepository.create(content);
  }
}
