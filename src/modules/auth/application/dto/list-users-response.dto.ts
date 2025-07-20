import { UserRole } from '../../../../entities/user.entity';

export class UserListItemDto {
    id: string;
    fullName: string;
    email?: string;
    username?: string;
    emailVerified: boolean;
    phoneNumber?: string;
    role: UserRole;
    isActive: boolean;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;

    constructor(user: any) {
        this.id = user.id;
        this.fullName = user.full_name;
        this.email = user.email;
        this.username = user.username;
        this.emailVerified = user.email_verified;
        this.phoneNumber = user.phone_number;
        this.role = user.role;
        this.isActive = user.is_active;
        this.lastLoginAt = user.last_login_at;
        this.createdAt = user.created_at;
        this.updatedAt = user.updated_at;
    }
}

export class PaginationMetaDto {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;

    constructor(
        currentPage: number,
        itemsPerPage: number,
        totalItems: number
    ) {
        this.currentPage = currentPage;
        this.itemsPerPage = itemsPerPage;
        this.totalItems = totalItems;
        this.totalPages = Math.ceil(totalItems / itemsPerPage);
        this.hasNextPage = currentPage < this.totalPages;
        this.hasPreviousPage = currentPage > 1;
    }
}

export class ListUsersResponseDto {
    data: UserListItemDto[];
    meta: PaginationMetaDto;

    constructor(users: any[], totalItems: number, page: number, limit: number) {
        this.data = users.map(user => new UserListItemDto(user));
        this.meta = new PaginationMetaDto(page, limit, totalItems);
    }
}
