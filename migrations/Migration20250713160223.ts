import { Migration } from '@mikro-orm/migrations';

export class Migration20250713160223 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "users" ("id" uuid not null, "full_name" varchar(255) not null, "email" varchar(255) null, "username" varchar(255) null, "hashed_password" varchar(255) null, "email_verified" boolean not null default false, "phone_number" varchar(255) null, "role" text check ("role" in ('USER', 'ADMIN', 'SUPERADMIN')) not null default 'USER', "is_active" boolean not null default true, "last_login_at" timestamptz null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, constraint "users_pkey" primary key ("id"));`);
    this.addSql(`alter table "users" add constraint "users_email_unique" unique ("email");`);
    this.addSql(`alter table "users" add constraint "users_username_unique" unique ("username");`);

    this.addSql(`create table "user_providers" ("id" uuid not null, "user_id" uuid not null, "provider" text check ("provider" in ('GOOGLE', 'GITHUB', 'FACEBOOK', 'APPLE', 'LOCAL')) not null, "provider_user_id" varchar(255) not null, "access_token" varchar(255) null, "refresh_token" varchar(255) null, "linked_at" timestamptz not null, constraint "user_providers_pkey" primary key ("id"));`);

    this.addSql(`alter table "user_providers" add constraint "user_providers_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user_providers" drop constraint "user_providers_user_id_foreign";`);

    this.addSql(`drop table if exists "users" cascade;`);

    this.addSql(`drop table if exists "user_providers" cascade;`);
  }

}
