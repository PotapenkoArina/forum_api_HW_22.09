import 'dotenv/config';
import postgres from '@prisma/orm-postgres/runtime';
import { Temporal } from '@js-temporal/polyfill';
import type { Contract } from './contract.d';
import contractJson from './contract.json' with { type: 'json' };

if (!('Temporal' in globalThis)) {
  Object.defineProperty(globalThis, 'Temporal', {
    value: Temporal,
    configurable: true,
    writable: true,
  });
}

const databaseUrl = process.env['DATABASE_URL'];

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined');
}

export const db = postgres<Contract>({
  contractJson,
  url: databaseUrl,
});
