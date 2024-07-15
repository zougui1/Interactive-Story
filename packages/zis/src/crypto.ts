import crypto from 'node:crypto';

export const encrypt = (text: Buffer, staticKey: string): string => {
  const randomKey = crypto.randomBytes(16);

  const key = Buffer.concat([
    Buffer.from(staticKey, 'base64url'),
    randomKey,
  ]);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return `${iv.toString('base64url')}${randomKey.toString('base64url')}${encrypted.toString('base64url')}`;
}

export const decrypt = (encrypted: string, staticKey: string): Buffer => {
  const iv = Buffer.from(encrypted.slice(0, 22), 'base64url');
  const randomKey = Buffer.from(encrypted.slice(22, 44), 'base64url');
  const key = Buffer.concat([
    Buffer.from(staticKey, 'base64url'),
    randomKey,
  ]);
  const content = Buffer.from(encrypted.slice(44), 'base64url');

  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

  let decrypted = decipher.update(content);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted;
}
