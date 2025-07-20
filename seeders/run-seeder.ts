import { MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from '../src/mikro-orm.config';
import { DatabaseSeeder } from './DatabaseSeeder';

async function runSeeder() {
    const orm = await MikroORM.init(mikroOrmConfig);
    const generator = orm.getSchemaGenerator();
    
    try {
        console.log('🔄 Connecting to database...');
        
        // Ensure database schema is up to date
        await generator.updateSchema();
        
        // Run seeders
        const seeder = orm.getSeeder();
        await seeder.seed(DatabaseSeeder);
        
        console.log('✅ Seeding completed successfully!');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    } finally {
        await orm.close();
    }
}

// Run if this file is executed directly
if (require.main === module) {
    runSeeder();
}

export { runSeeder };
