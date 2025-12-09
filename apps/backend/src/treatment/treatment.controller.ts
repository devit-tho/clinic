import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@repo/entities';
import { Action, Resource } from '@repo/permissions';
import { Request } from 'express';
import {
  PermissionGuard,
  Permissions,
} from 'src/common/guards/permission.guard';
import { RoleGuard, Roles } from 'src/common/guards/role.guard';
import { TreatmentDto } from './treatment.dto';
import { TreatmentService } from './treatment.service';

@UseGuards(RoleGuard, PermissionGuard)
@Controller('treatment')
@Roles(Role.DOCTOR)
export class TreatmentController {
  constructor(private readonly treatmentService: TreatmentService) {}

  @Get()
  @Permissions({ resource: Resource.treatment, actions: Action.READ })
  async getAll() {
    return this.treatmentService.getAll();
  }

  @Get(':id')
  @Permissions({ resource: Resource.treatment, actions: Action.READ })
  async getById(@Param('id') id: string) {
    return this.treatmentService.getById(id);
  }

  @Post()
  @Permissions({ resource: Resource.treatment, actions: Action.CREATE })
  async create(@Req() req: Request, @Body() dto: TreatmentDto) {
    return this.treatmentService.create(req, dto);
  }

  @Patch(':id')
  @Permissions({ resource: Resource.treatment, actions: Action.UPDATE })
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: TreatmentDto,
  ) {
    return this.treatmentService.update(req, id, dto);
  }

  @Delete(':id')
  @Permissions({ resource: Resource.treatment, actions: Action.DELETE })
  async delete(@Req() req: Request, @Param('id') id: string) {
    return this.treatmentService.delete(req, id);
  }
}
