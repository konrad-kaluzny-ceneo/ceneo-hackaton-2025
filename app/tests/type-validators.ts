import { Accommodation } from '../src/types/accommodation';
import { LocationWithDetails, LocationInApp, Attraction, MonthConditions } from '../src/types/location';
import { Transport } from '../src/types/transport';

export const isValidString = (value: unknown): value is string => 
  typeof value === 'string' && value.length > 0;

export const isValidNumber = (value: unknown): value is number => 
  typeof value === 'number' && !isNaN(value);

export const isValidStringArray = (value: unknown): value is string[] => 
  Array.isArray(value) && value.every(item => isValidString(item));

export const isValidDate = (value: unknown): value is Date => 
  value instanceof Date && !isNaN(value.getTime());

export const isValidDateString = (value: unknown): value is string => 
  isValidString(value) && !isNaN(Date.parse(value));

export const isValidObject = (value: unknown): value is Record<string, unknown> => 
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const hasRequiredKeys = (obj: Record<string, unknown>, keys: string[]): boolean => 
  keys.every(key => key in obj);

export const isValidAccommodation = (value: unknown): value is Accommodation => {
  if (!isValidObject(value)) return false;
  
  const requiredKeys = ['id', 'locationId', 'date', 'price', 'beds', 'name', 'description', 'images'];
  if (!hasRequiredKeys(value, requiredKeys)) return false;
  
  return isValidString(value.id) &&
         isValidString(value.locationId) &&
         isValidDateString(value.date) &&
         isValidNumber(value.price) &&
         isValidNumber(value.beds) &&
         isValidString(value.name) &&
         isValidString(value.description) &&
         isValidStringArray(value.images);
};

export const isValidLocation = (value: unknown): value is LocationInApp => {
  if (!isValidObject(value)) return false;
  
  const requiredKeys = ['id', 'country', 'region', 'city'];
  if (!hasRequiredKeys(value, requiredKeys)) return false;
  
  return isValidString(value.id) &&
         isValidString(value.country) &&
         isValidString(value.region) &&
         isValidString(value.city);
};

export const isValidAttraction = (value: unknown): value is Attraction => {
  if (!isValidObject(value)) return false;
  
  const requiredKeys = ['name', 'description', 'price', 'images'];
  if (!hasRequiredKeys(value, requiredKeys)) return false;
  
  return isValidString(value.name) &&
         isValidString(value.description) &&
         isValidNumber(value.price) &&
         isValidStringArray(value.images);
};

export const isValidMonthConditions = (value: unknown): value is MonthConditions => {
  if (!isValidObject(value)) return false;
  
  const requiredKeys = ['density', 'temp'];
  if (!hasRequiredKeys(value, requiredKeys)) return false;
  
  return isValidNumber(value.density) &&
         isValidNumber(value.temp);
};

export const isValidLocationWithDetails = (value: unknown): value is LocationWithDetails => {
  if (!isValidObject(value)) return false;
  
  const requiredKeys = ['id', 'location', 'attractions', 'conditionsInMonth'];
  if (!hasRequiredKeys(value, requiredKeys)) return false;
  
  if (!isValidObject(value.location)) return false;
  const locationWithId = { ...value.location, id: value.id };
  if (!isValidLocation(locationWithId)) return false;
  if (!Array.isArray(value.attractions) || !value.attractions.every(attr => isValidAttraction(attr))) return false;
  if (!isValidObject(value.conditionsInMonth)) return false;
  
  return Object.values(value.conditionsInMonth).every(condition => isValidMonthConditions(condition));
};

export const isValidTransport = (value: unknown): value is Transport => {
  if (!isValidObject(value)) return false;
  
  const requiredKeys = ['id', 'fromLocationId', 'fromDate', 'toLocationId', 'toDate', 'price', 'name'];
  if (!hasRequiredKeys(value, requiredKeys)) return false;
  
  return isValidString(value.id) &&
         isValidString(value.fromLocationId) &&
         isValidDateString(value.fromDate) &&
         isValidString(value.toLocationId) &&
         isValidDateString(value.toDate) &&
         isValidNumber(value.price) &&
         isValidString(value.name);
};

export const validateJsonData = <T>(
  data: unknown,
  validator: (value: unknown) => value is T,
  dataType: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!Array.isArray(data)) {
    errors.push(`${dataType} data must be an array`);
    return { isValid: false, errors };
  }
  
  data.forEach((item, index) => {
    if (!validator(item)) {
      errors.push(`${dataType} item at index ${index} is invalid`);
    }
  });
  
  return { isValid: errors.length === 0, errors };
};
