import { uuidv7 } from 'uuidv7';

/**
 * Generate a UUID v7
 * UUID v7 is time-ordered and has better performance characteristics
 * compared to UUID v4 for database usage
 */
export function generateUuid(): string {
    return uuidv7();
}

/**
 * Generate a UUID v7 with custom timestamp
 * @param timestamp - The timestamp to use (defaults to current time)
 */
export function generateUuidWithTimestamp(timestamp?: number): string {
    return uuidv7();
}

/**
 * Extract timestamp from UUID v7
 * @param uuid - The UUID v7 string
 * @returns The timestamp in milliseconds
 */
export function extractTimestampFromUuid(uuid: string): number {
    const timestampHex = uuid.replace(/-/g, '').substring(0, 12);
    return parseInt(timestampHex, 16);
}

/**
 * Check if a UUID is version 7
 * @param uuid - The UUID string to check
 */
export function isUuidV7(uuid: string): boolean {
    const version = uuid.charAt(14);
    return version === '7';
}
