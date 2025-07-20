import { Transform, Type } from 'class-transformer';
import { IsOptional, IsInt, Min, Max, IsString, IsEnum, IsBoolean } from 'class-validator';

export enum SortOrder {
    ASC = 'asc',
    DESC = 'desc',
}

export enum UserSortField {
    CREATED_AT = 'created_at',
    UPDATED_AT = 'updated_at',
    FULL_NAME = 'full_name',
    EMAIL = 'email',
    LAST_LOGIN_AT = 'last_login_at',
}

export class ListUsersQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'Page must be an integer' })
    @Min(1, { message: 'Page must be at least 1' })
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'Limit must be an integer' })
    @Min(1, { message: 'Limit must be at least 1' })
    @Max(100, { message: 'Limit cannot exceed 100' })
    limit?: number = 10;

    @IsOptional()
    @IsString({ message: 'Search must be a string' })
    @Transform(({ value }) => value?.trim())
    search?: string;

    @IsOptional()
    @IsEnum(UserSortField, { message: 'Invalid sort field' })
    sortBy?: UserSortField = UserSortField.CREATED_AT;

    @IsOptional()
    @IsEnum(SortOrder, { message: 'Sort order must be asc or desc' })
    sortOrder?: SortOrder = SortOrder.DESC;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return value;
    })
    @IsBoolean({ message: 'emailVerified must be a boolean' })
    emailVerified?: boolean;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return value;
    })
    @IsBoolean({ message: 'isActive must be a boolean' })
    isActive?: boolean;
}
