import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Role, UserWithoutPassword } from '@repo/entities';
import { Action, Resource } from '@repo/permissions';
import { Request } from 'express';
import { GetUser } from 'src/common/decorators';
import {
  PermissionGuard,
  Permissions,
} from 'src/common/guards/permission.guard';
import { RoleGuard, Roles } from 'src/common/guards/role.guard';
import { PatientDto } from './patient.dto';
import { PatientService } from './patient.service';

@UseGuards(RoleGuard, PermissionGuard)
@Controller('patient')
@Roles(Role.DOCTOR, Role.STAFF)
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  @Permissions({ resource: Resource.patient, actions: Action.READ })
  async getAll(@GetUser() user: UserWithoutPassword) {
    return this.patientService.getAll(user);
  }

  @Get('recent')
  async getRecent() {
    return this.patientService.getRecent();
  }

  @Get(':id')
  @Permissions({ resource: Resource.patient, actions: Action.READ })
  async getById(@Param('id') id: string) {
    return this.patientService.getById(id);
  }

  @Post()
  @Permissions({ resource: Resource.patient, actions: Action.CREATE })
  async create(@Req() req: Request, @Body() dto: PatientDto) {
    await this.patientService.create(req, dto);
  }

  @Put(':id')
  @Permissions({ resource: Resource.patient, actions: Action.UPDATE })
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: PatientDto,
  ) {
    await this.patientService.update(req, id, dto);
  }

  @Delete(':id')
  @Permissions({ resource: Resource.patient, actions: Action.DELETE })
  async delete(@Req() req: Request, @Param('id') id: string) {
    await this.patientService.delete(req, id);
  }
}
