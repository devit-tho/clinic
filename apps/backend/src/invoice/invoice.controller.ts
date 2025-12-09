import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Role, UserWithoutPassword } from '@repo/entities';
import { Action, Resource } from '@repo/permissions';
import { GetUser } from 'src/common/decorators';
import {
  PermissionGuard,
  Permissions,
} from 'src/common/guards/permission.guard';
import { RoleGuard, Roles } from 'src/common/guards/role.guard';
import { InvoiceDetailDto, InvoiceDto } from './invoice.dto';
import { InvoiceService } from './invoice.service';

@UseGuards(RoleGuard, PermissionGuard)
@Controller('invoice')
@Roles(Role.DOCTOR, Role.STAFF)
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get()
  @Permissions({ resource: Resource.invoice, actions: Action.READ })
  async getAll() {
    return this.invoiceService.getAll();
  }

  @Get('inv-no')
  @Permissions({ resource: Resource.invoice, actions: Action.READ })
  async getInvNo() {
    return this.invoiceService.getInvNo();
  }

  @Get(':id')
  @Permissions({ resource: Resource.invoice, actions: Action.READ })
  async getById(@Param('id') id: string) {
    return this.invoiceService.getById(id);
  }

  @Get(':id/inv-no')
  @Permissions({ resource: Resource.invoice, actions: Action.READ })
  async getInvNoById(@Param('id') id: string) {
    return this.invoiceService.getInvoiceNoById(id);
  }

  @Post('detail')
  @Permissions({ resource: Resource.invoice, actions: Action.CREATE_INVOICES })
  async createInvoiceWithDetails(
    @GetUser() user: UserWithoutPassword,
    @Body() dto: InvoiceDetailDto,
  ) {
    return this.invoiceService.createInvoiceWithDetails(user, dto);
  }

  @Post()
  @Permissions({ resource: Resource.invoice, actions: Action.CREATE_INVOICES })
  async create(@GetUser() user: UserWithoutPassword, @Body() dto: InvoiceDto) {
    return this.invoiceService.create(user, dto);
  }

  @Delete(':id')
  @Permissions({ resource: Resource.invoice, actions: Action.DELETE_INVOICES })
  async delete(@GetUser() user: UserWithoutPassword, @Param('id') id: string) {
    return this.invoiceService.delete(user, id);
  }

  // @Post(':invoiceId/detail')
  // async createDetail(
  //   @GetUser() user: UserWithoutPassword,
  //   @Param() invoiceId: string,
  //   @Body() dto: DetailDto,
  // ) {
  //   return this.detailService.create(user, invoiceId, dto);
  // }

  // @Delete(':invoiceId/detail/all')
  // async deleteAllDetail(
  //   @GetUser() user: UserWithoutPassword,
  //   @Param('invoiceId') invoiceId: string,
  // ) {
  //   return this.detailService.deleteAllDetail(user, invoiceId);
  // }
}
