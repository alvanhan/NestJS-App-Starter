import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { UserSeeder } from './UserSeeder';

export class DatabaseSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        console.log('Starting database seeding...\n');
        
        // Run all seeders
        await this.call(em, [
            UserSeeder,
        ]);
        
        console.log('\nDatabase seeding completed successfully!');
    }
}
