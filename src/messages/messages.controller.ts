import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageService } from './messages.service';

@Controller('messages')
export class MessagesController {
  messagesService: MessageService;

  constructor() {
    // DON'T THIS ON PRODUCTION APPS
    this.messagesService = new MessageService();
  }

  @Get()
  getAllMessages(): Promise<void> {
    return this.messagesService.findAll();
  }

  @Get(':id')
  async getMessage(@Param('id') id: string): Promise<any> {
    const message = await this.messagesService.finOne(id);

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return message;
  }

  @Post()
  createMessage(@Body() body: CreateMessageDto): Promise<void> {
    return this.messagesService.create(body.content);
  }
}
