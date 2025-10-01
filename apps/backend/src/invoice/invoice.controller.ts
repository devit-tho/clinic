import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserWithoutPassword } from '@repo/entities';
import { GetUser } from 'src/decorators';
import { DetailDto } from 'src/detail/detail.dto';
import { DetailService } from 'src/detail/detail.service';
import { InvoiceDetailDto, InvoiceDto } from './invoice.dto';
import { InvoiceService } from './invoice.service';

@Controller('invoice')
export class InvoiceController {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly detailService: DetailService,
  ) {}

  @Get()
  async getAll() {
    return this.invoiceService.getAll();
  }

  @Get('inv-no')
  async getInvNo() {
    return this.invoiceService.getInvNo();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.invoiceService.getById(id);
  }

  @Get(':id/inv-no')
  async getInvNoById(@Param('id') id: string) {
    return this.invoiceService.getInvoiceNoById(id);
  }

  @Post('detail')
  async createInvoiceWithDetails(
    @GetUser() user: UserWithoutPassword,
    @Body() dto: InvoiceDetailDto,
  ) {
    return this.invoiceService.createInvoiceWithDetails(user, dto);
  }

  @Post()
  async create(@GetUser() user: UserWithoutPassword, @Body() dto: InvoiceDto) {
    return this.invoiceService.create(user, dto);
  }

  @Delete(':id')
  async delete(@GetUser() user: UserWithoutPassword, @Param('id') id: string) {
    return this.invoiceService.delete(user, id);
  }

  @Post(':invoiceId/detail')
  async createDetail(
    @GetUser() user: UserWithoutPassword,
    @Param() invoiceId: string,
    @Body() dto: DetailDto,
  ) {
    return this.detailService.create(user, invoiceId, dto);
  }

  @Delete(':invoiceId/detail/all')
  async deleteAllDetail(
    @GetUser() user: UserWithoutPassword,
    @Param('invoiceId') invoiceId: string,
  ) {
    return this.detailService.deleteAllDetail(user, invoiceId);
  }
}
