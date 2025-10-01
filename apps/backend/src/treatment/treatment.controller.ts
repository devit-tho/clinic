import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { TreatmentDto } from './treatment.dto';
import { TreatmentService } from './treatment.service';

@Controller('treatment')
export class TreatmentController {
  constructor(private readonly treatmentService: TreatmentService) {}

  @Get()
  async getAll() {
    return this.treatmentService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.treatmentService.getById(id);
  }

  @Post()
  async create(@Req() req: Request, @Body() dto: TreatmentDto) {
    return this.treatmentService.create(req, dto);
  }

  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: TreatmentDto,
  ) {
    return this.treatmentService.update(req, id, dto);
  }

  @Delete(':id')
  async delete(@Req() req: Request, @Param('id') id: string) {
    return this.treatmentService.delete(req, id);
  }
}
