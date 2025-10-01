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
import { PatientDto } from './patient.dto';
import { PatientService } from './patient.service';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  async getAll(@Req() req: Request) {
    return this.patientService.getAll(req);
  }

  @Get('recent')
  async getRecent() {
    return this.patientService.getRecent();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.patientService.getById(id);
  }

  @Post()
  async create(@Req() req: Request, @Body() dto: PatientDto) {
    await this.patientService.create(req, dto);
  }

  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: PatientDto,
  ) {
    await this.patientService.update(req, id, dto);
  }

  @Delete(':id')
  async delete(@Req() req: Request, @Param('id') id: string) {
    await this.patientService.delete(req, id);
  }
}
