// Path: src/hello/factory/graphql/hello.module.ts
// DESC: hello controller
'use strict';
import { Module } from '@nestjs/common';
import { HelloResolver } from './hello.resolver';
import { HelloService } from '../../hello.service';

@Module({
  imports: [],
  providers: [HelloService, HelloResolver],
  exports: [HelloService],
})
export class HelloModule {}
