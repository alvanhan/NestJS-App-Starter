import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, QueryOrder, wrap } from '@mikro-orm/core';
import { User } from '../../../entities/user.entity';
import { ListUsersQueryDto, UserSortField, SortOrder } from '../application/dto/list-users-query.dto';
import { ListUsersResponseDto } from '../application/dto/list-users-response.dto';

@Injectable()
export class ListUsersUseCase {
    private readonly logger = new Logger(ListUsersUseCase.name);

    constructor(
        @InjectRepository(User)
        private readonly userRepository: EntityRepository<User>,
    ) {}

    async execute(queryDto: ListUsersQueryDto): Promise<ListUsersResponseDto> {
        const startTime = performance.now();
        
        try {
            this.logger.log(`Executing list users with filters: ${JSON.stringify(queryDto)}`);

            const {
                page = 1,
                limit = 10,
                search,
                sortBy = UserSortField.CREATED_AT,
                sortOrder = SortOrder.DESC,
                emailVerified,
                isActive,
            } = queryDto;

            // Calculate offset
            const offset = (page - 1) * limit;

            // Build where conditions
            const whereConditions: any = {
                deleted_at: null, // Only get non-deleted users
            };

            // Apply filters
            if (emailVerified !== undefined) {
                whereConditions.email_verified = emailVerified;
            }

            if (isActive !== undefined) {
                whereConditions.is_active = isActive;
            }

            // Apply search filter
            if (search) {
                const searchTerm = `%${search.toLowerCase()}%`;
                whereConditions.$or = [
                    { full_name: { $ilike: searchTerm } },
                    { email: { $ilike: searchTerm } },
                    { username: { $ilike: searchTerm } },
                ];
            }

            // Convert sort order to MikroORM format
            const orderDirection = sortOrder === SortOrder.ASC ? QueryOrder.ASC : QueryOrder.DESC;

            // Execute queries in parallel for better performance
            const [users, totalCount] = await Promise.all([
                this.userRepository.find(
                    whereConditions,
                    {
                        orderBy: { [sortBy]: orderDirection },
                        limit,
                        offset,
                        fields: [
                            'id',
                            'full_name',
                            'email',
                            'username',
                            'email_verified',
                            'phone_number',
                            'role',
                            'is_active',
                            'last_login_at',
                            'created_at',
                            'updated_at',
                        ],
                    }
                ),
                this.userRepository.count(whereConditions),
            ]);

            const executionTime = performance.now() - startTime;
            
            this.logger.log(
                `Retrieved ${users.length} users out of ${totalCount} total in ${executionTime.toFixed(2)}ms`
            );

            return new ListUsersResponseDto(users, totalCount, page, limit);
        } catch (error) {
            const executionTime = performance.now() - startTime;
            this.logger.error(
                `Failed to list users after ${executionTime.toFixed(2)}ms: ${error.message}`,
                error.stack
            );
            throw new Error(`Failed to retrieve users: ${error.message}`);
        }
    }

    /**
     * Get user statistics for dashboard
     */
    async getUserStats(): Promise<{
        totalUsers: number;
        activeUsers: number;
        verifiedUsers: number;
        newUsersToday: number;
    }> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [totalUsers, activeUsers, verifiedUsers, newUsersToday] = await Promise.all([
            this.userRepository.count({ deleted_at: null }),
            this.userRepository.count({ deleted_at: null, is_active: true }),
            this.userRepository.count({ deleted_at: null, email_verified: true }),
            this.userRepository.count({
                deleted_at: null,
                created_at: { $gte: today },
            }),
        ]);

        return {
            totalUsers,
            activeUsers,
            verifiedUsers,
            newUsersToday,
        };
    }
}
