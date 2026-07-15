import { PasswordService } from './password.service.js';

describe('PasswordService', () => {
  const service = new PasswordService();

  it('stores passwords as scrypt hashes and verifies the original password', async () => {
    const hash = await service.hash('senha-super-secreta');

    expect(hash).not.toBe('senha-super-secreta');
    expect(hash.startsWith('scrypt$')).toBe(true);
    await expect(service.verify('senha-super-secreta', hash)).resolves.toBe(true);
    await expect(service.verify('senha-errada', hash)).resolves.toBe(false);
  });
});
