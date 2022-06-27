import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
  getMessage(@Param('id') id: string) {
    return this.messagesService.finOne(id);
  }

  @Post()
  createMessage(@Body() body: CreateMessageDto) {
    return this.messagesService.create(body.content);
  }
}
