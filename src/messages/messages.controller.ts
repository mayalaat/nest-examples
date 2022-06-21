import { Body, Controller, Get, Param, Post } from '@nestjs/common';

@Controller('messages')
export class MessagesController {

    @Get()
    getAllMessages() {
    }


    @Get(':id')
    getMessage(@Param('id') id: string) {
        console.log(id);
    }

    @Post()
    createMessage(@Body() body: any) {
        console.log(body);
    }

}
