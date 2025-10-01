import { Module } from '@nestjs/common';

import { DetailService } from './detail.service';

@Module({
  imports: [],
  controllers: [],
  providers: [DetailService],
  exports: [DetailService],
})
export class DetailModule {}
