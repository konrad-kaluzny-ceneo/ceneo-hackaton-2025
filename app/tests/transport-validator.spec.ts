import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { isValidTransport, validateJsonData } from './type-validators';

const loadJsonData = (filename: string) => {
  const filePath = join(process.cwd(), 'src', 'local-data', filename);
  return JSON.parse(readFileSync(filePath, 'utf-8'));
};

describe('Transport Data Validation', () => {
  it('should validate transport.json structure', () => {
    const data = loadJsonData('transport.json');
    const result = validateJsonData(data, isValidTransport, 'Transport');
    
    expect(result.isValid).toBe(true);
    if (!result.isValid) {
      console.error('Transport validation errors:', result.errors);
    }
  });
});
