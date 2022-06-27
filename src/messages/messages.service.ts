import { MessagesRepository } from './messages.repository';

export class MessageService {
  messageRepository: MessagesRepository;

  constructor() {
    // DON'T THIS ON PRODUCTION APPS
    this.messageRepository = new MessagesRepository();
  }

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
