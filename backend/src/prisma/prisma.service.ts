import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  prisma: PrismaClient;

  constructor() {
    const dbUrl = process.env.DATABASE_URL ?? ':memory:';
    const adapterFactory = new PrismaBetterSqlite3({ url: dbUrl });
    this.prisma = new PrismaClient({ adapter: adapterFactory } as any);
  }

  // No .NET seria como o OnConfiguring ou a abertura da conexão
  async onModuleInit() {
    await this.prisma.$connect();
  }

  // Garante que a conexão seja encerrada graciosamente ao desligar o servidor
  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }
}