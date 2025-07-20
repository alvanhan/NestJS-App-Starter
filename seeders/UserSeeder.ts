import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { User } from '../src/entities/user.entity';
import { UserFactory } from './factories/UserFactory';

export class UserSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        const existingUsersCount = await em.count(User);
        if (existingUsersCount > 0) {
            console.log('Users already exist, skipping user seeding...');
            return;
        }
        console.log('Seeding users...');
        const seedUsersData = UserFactory.getDefaultSeedUsers();
        const users = await UserFactory.createMany(seedUsersData);
        for (const user of users) {
            em.persist(user);
            console.log(`Created user: ${user.full_name} (${user.role})`);
        }
        await em.flush();
        console.log('User seeding completed!');
    }
}
