#!/usr/bin/env node
import dotenv from 'dotenv';
dotenv.config();

import { isENSSnipeable } from '../utils/boltensutils.js';

const usage = () => {
  console.log('Usage: node src/scripts/speedcheck.js <domain>');
  console.log('Example: node src/scripts/speedcheck.js 9999.eth');
};

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    usage();
    process.exit(1);
  }

  // Normalize: ensure .eth suffix once, lowercase
  let domain = arg.toLowerCase();
  if (!domain.endsWith('.eth')) {
    domain = `${domain}.eth`;
  }

  try {
    const res = await isENSSnipeable(domain);
    if (res.error) {
      console.error(`Error: ${res.error}`);
      process.exit(2);
    }

    const exp = res.expirationDate instanceof Date ? res.expirationDate : new Date(res.expirationDate);
    const grace = res.graceEnd instanceof Date ? res.graceEnd : new Date(res.graceEnd);

    console.log(`Domain: ${res.domain}`);
    console.log(`Expiration: ${exp.toISOString()}`);
    console.log(`Grace End: ${grace.toISOString()}`);
    console.log(`Snipeable: ${res.snipeable ? 'YES' : 'NO'}`);
    if (typeof res.price === 'number') {
      console.log(`Estimated Net Reg Price: ${res.price.toFixed(2)} USD (approx)`);
    }
  } catch (err) {
    console.error('Failed to check domain:', err?.message || err);
    process.exit(3);
  }
}

main();
