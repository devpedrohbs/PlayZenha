import { Injectable } from '@nestjs/common';
import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from 'node:crypto';
import type { ScryptOptions } from 'node:crypto';

const SCRYPT_PARAMS = {
  keyLength: 64,
  cost: 16384,
  blockSize: 8,
  parallelization: 1,
};

@Injectable()
export class PasswordService {
  async hash(password: string): Promise<string> {
    const salt = randomBytes(16).toString('base64url');
    const derivedKey = await scrypt(password, salt, SCRYPT_PARAMS.keyLength, {
      N: SCRYPT_PARAMS.cost,
      r: SCRYPT_PARAMS.blockSize,
      p: SCRYPT_PARAMS.parallelization,
    });

    return [
      'scrypt',
      SCRYPT_PARAMS.cost,
      SCRYPT_PARAMS.blockSize,
      SCRYPT_PARAMS.parallelization,
      salt,
      derivedKey.toString('base64url'),
    ].join('$');
  }

  async verify(password: string, storedHash: string): Promise<boolean> {
    const parts = storedHash.split('$');

    if (parts.length !== 6 || parts[0] !== 'scrypt') {
      return false;
    }

    const cost = parts[1] ?? '';
    const blockSize = parts[2] ?? '';
    const parallelization = parts[3] ?? '';
    const salt = parts[4] ?? '';
    const encodedHash = parts[5] ?? '';
    const expectedHash = Buffer.from(encodedHash, 'base64url');
    const actualHash = await scrypt(password, salt, expectedHash.length, {
      N: Number(cost),
      r: Number(blockSize),
      p: Number(parallelization),
    });

    return (
      actualHash.length === expectedHash.length &&
      timingSafeEqual(actualHash, expectedHash)
    );
  }
}

function scrypt(
  password: string,
  salt: string,
  keyLength: number,
  options: ScryptOptions
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(password, salt, keyLength, options, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(derivedKey);
    });
  });
}
