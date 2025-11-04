import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from '../dto/create-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(@Body() dto: CreateMessageDto) {
    return this.messagesService.create(dto);
  }

  @Get()
  findAll() {
    return this.messagesService.findAll();
  }

  @Patch(':id/read/:read')
  markRead(@Param('id') id: string, @Param('read') read: string) {
    return this.messagesService.markRead(id, read === 'true');
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.delete(id);
  }
}


