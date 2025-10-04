import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { LocationInApp } from "@/types/location";
import { Transport } from "@/types/transport";
import { Accommodation } from "@/types/accommodation";

const loadJsonData = (filename: string) => {
  const filePath = join(process.cwd(), "src", "local-data", filename);
  return JSON.parse(readFileSync(filePath, "utf-8"));
};

describe("Cross-File Data Consistency", () => {
  const locations = loadJsonData("locations.json");
  const accommodations = loadJsonData("accomodation.json");
  const transports = loadJsonData("transport.json");

  describe("Location ID Validation", () => {
    it("should have valid location IDs in locations.json", () => {
      const locationIds = locations.map((loc: LocationInApp) => loc.id);
      const uniqueIds = new Set(locationIds);

      expect(locationIds.length).toBe(uniqueIds.size);
      expect(locationIds.every((id: string) => typeof id === "string" && id.length > 0)).toBe(true);
    });

    it("should have unique location IDs", () => {
      const locationIds = locations.map((loc: LocationInApp) => loc.id);
      const uniqueIds = new Set(locationIds);

      expect(locationIds.length).toBe(uniqueIds.size);
    });
  });

  describe("Transport Location References", () => {
    it("should reference valid location IDs in transport data", () => {
      const validLocationIds = new Set(locations.map((loc: LocationInApp) => loc.id));

      transports.forEach((transport: Transport, index: number) => {
        expect(validLocationIds.has(transport.fromLocationId)).toBe(true);
        expect(validLocationIds.has(transport.toLocationId)).toBe(true);
      });
    });

    it("should have valid date formats in transport data", () => {
      transports.forEach((transport: Transport, index: number) => {
        expect(() => new Date(transport.fromDate)).not.toThrow();
        expect(() => new Date(transport.toDate)).not.toThrow();
        expect(new Date(transport.fromDate).getTime()).not.toBeNaN();
        expect(new Date(transport.toDate).getTime()).not.toBeNaN();
      });
    });
  });

  describe("Accommodation Location References", () => {
    it("should reference valid location IDs in accommodation data", () => {
      const validLocationIds = new Set(locations.map((loc: LocationInApp) => loc.id));
      const invalidReferences: string[] = [];

      accommodations.forEach((accommodation: Accommodation, index: number) => {
        if (!validLocationIds.has(accommodation.locationId)) {
          invalidReferences.push(`Accommodation ${index}: ${accommodation.locationId}`);
        }
      });

      if (invalidReferences.length > 0) {
        console.warn("Invalid location references found:", invalidReferences);
        console.warn("Available location IDs:", Array.from(validLocationIds));
      }

      expect(invalidReferences.length).toBe(0);
    });

    it("should have valid date formats in accommodation data", () => {
      accommodations.forEach((accommodation: Accommodation, index: number) => {
        expect(() => new Date(accommodation.date)).not.toThrow();
        expect(new Date(accommodation.date).getTime()).not.toBeNaN();
      });
    });
  });

  describe("Data Integrity", () => {
    it("should have consistent data types across all files", () => {
      expect(Array.isArray(locations)).toBe(true);
      expect(Array.isArray(accommodations)).toBe(true);
      expect(Array.isArray(transports)).toBe(true);
    });

    it("should have non-empty data in all files", () => {
      expect(locations.length).toBeGreaterThan(0);
      expect(accommodations.length).toBeGreaterThan(0);
      expect(transports.length).toBeGreaterThan(0);
    });

    it("should have unique IDs within each data type", () => {
      const locationIds = locations.map((loc: LocationInApp) => loc.id);
      const accommodationIds = accommodations.map((acc: Accommodation) => acc.id);

      expect(new Set(locationIds).size).toBe(locationIds.length);

      const uniqueAccommodationIds = new Set(accommodationIds);
      const duplicateIds = accommodationIds.filter((id: string, index: number) => accommodationIds.indexOf(id) !== index);

      if (duplicateIds.length > 0) {
        console.warn(`Found duplicate accommodation IDs: ${duplicateIds}`);
      }

      expect(uniqueAccommodationIds.size).toBe(accommodationIds.length);
    });

    it("should document data quality issues found", () => {
      const validLocationIds = new Set(locations.map((loc: LocationInApp) => loc.id));
      const invalidAccommodationRefs = accommodations.filter((acc: Accommodation) => !validLocationIds.has(acc.locationId));
      const accommodationIds = accommodations.map((acc: Accommodation) => acc.id);
      const uniqueAccommodationIds = new Set(accommodationIds);

      console.log("Data Quality Report:");
      console.log(`- Invalid accommodation location references: ${invalidAccommodationRefs.length}`);
      console.log(`- Duplicate accommodation IDs: ${accommodationIds.length - uniqueAccommodationIds.size}`);
      console.log(`- Total locations: ${locations.length}`);
      console.log(`- Total accommodations: ${accommodations.length}`);
      console.log(`- Total transports: ${transports.length}`);

      expect(true).toBe(true);
    });
  });

  describe("Date Consistency", () => {
    it("should have valid date ranges in transport data", () => {
      transports.forEach((transport: Transport, index: number) => {
        const fromDate = new Date(transport.fromDate);
        const toDate = new Date(transport.toDate);

        expect(fromDate.getTime()).not.toBeNaN();
        expect(toDate.getTime()).not.toBeNaN();
        expect(fromDate <= toDate).toBe(true);
      });
    });

    it("should have reasonable date ranges", () => {
      const currentYear = new Date().getFullYear();
      const futureYear = currentYear + 2;

      accommodations.forEach((accommodation: Accommodation, index: number) => {
        const date = new Date(accommodation.date);
        expect(date.getFullYear()).toBeGreaterThanOrEqual(currentYear);
        expect(date.getFullYear()).toBeLessThanOrEqual(futureYear);
      });

      transports.forEach((transport: Transport, index: number) => {
        const fromDate = new Date(transport.fromDate);
        const toDate = new Date(transport.toDate);
        expect(fromDate.getFullYear()).toBeGreaterThanOrEqual(currentYear);
        expect(fromDate.getFullYear()).toBeLessThanOrEqual(futureYear);
      });
    });
  });
});
