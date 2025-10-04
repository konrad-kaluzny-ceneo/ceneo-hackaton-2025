import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  isValidAccommodation,
  isValidLocationWithDetails,
  isValidTransport,
  validateJsonData
} from './type-validators';

const loadJsonData = (filename: string) => {
  const filePath = join(process.cwd(), 'src', 'local-data', filename);
  return JSON.parse(readFileSync(filePath, 'utf-8'));
};

describe('Local Data Type Validation', () => {
  describe('Accommodation Data', () => {
    it('should validate accommodation.json structure', () => {
      const data = loadJsonData('accomodation.json');
      const result = validateJsonData(data, isValidAccommodation, 'Accommodation');
      
      expect(result.isValid).toBe(true);
      if (!result.isValid) {
        console.error('Accommodation validation errors:', result.errors);
      }
    });
  });

  describe('Location Data', () => {
    it('should validate locations.json structure', () => {
      const data = loadJsonData('locations.json');
      const result = validateJsonData(data, isValidLocationWithDetails, 'LocationWithDetails');
      
      expect(result.isValid).toBe(true);
      if (!result.isValid) {
        console.error('Location validation errors:', result.errors);
      }
    });
  });

  describe('Transport Data', () => {
    it('should validate transport.json structure', () => {
      const data = loadJsonData('transport.json');
      const result = validateJsonData(data, isValidTransport, 'Transport');
      
      expect(result.isValid).toBe(true);
      if (!result.isValid) {
        console.error('Transport validation errors:', result.errors);
      }
    });
  });
});
