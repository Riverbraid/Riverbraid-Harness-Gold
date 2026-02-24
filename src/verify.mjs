// Riverbraid-Crypto-Gold – Mechanical Honesty
// 7-bit ASCII only. Zero entropy.
import crypto from 'crypto';

export const verifySeal = (data, expectedRoot) => {
  const actualRoot = crypto.createHash('sha256').update(data).digest('hex');
  
  if (actualRoot !== expectedRoot) {
    throw new Error(`MECHANICAL_HONESTY_VIOLATION: Root mismatch. Expected ${expectedRoot}, got ${actualRoot}`);
  }

  return {
    status: 'SEAL_INTACT',
    fingerprint: 'D9475D6B717D0E6C8EC84F6D8F86D9F4F2B083A4',
    verified: true
  };
};

// Internal 7-bit ASCII check
export const isPureASCII = (str) => /^[\x00-\x7F]*$/.test(str);
