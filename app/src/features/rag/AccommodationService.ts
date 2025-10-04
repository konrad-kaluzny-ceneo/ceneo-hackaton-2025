import fs from 'fs/promises';
import path from 'path';
import { AccommodationWithEmbeddings } from './types';

export class AccommodationService {
  private accommodationPath: string;

  constructor() {
    this.accommodationPath = path.join(process.cwd(), 'src', 'local-data', 'accommodation.json');
  }

  async loadAccommodations(): Promise<AccommodationWithEmbeddings[]> {
    const accommodationsRaw = await fs.readFile(this.accommodationPath, 'utf-8');
    return JSON.parse(accommodationsRaw);
  }

  async saveAccommodations(accommodations: AccommodationWithEmbeddings[]): Promise<void> {
    const updatedJson = JSON.stringify(accommodations, null, 2);
    await fs.writeFile(this.accommodationPath, updatedJson, 'utf-8');
  }

  hasEmbeddings(accommodations: AccommodationWithEmbeddings[]): boolean {
    return accommodations.some(acc => acc.embedding && acc.embedding.length > 0);
  }
}
