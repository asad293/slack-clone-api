import { Migration } from '@mikro-orm/migrations';

export class Migration20201006212755 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "display_name" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null);');

    this.addSql('create table "workspace" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "link" varchar(255) not null, "owner_id" int4 not null);');
    this.addSql('alter table "workspace" add constraint "workspace_owner_id_unique" unique ("owner_id");');

    this.addSql('create table "channel" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "is_public" bool not null, "owner_id" int4 not null, "workspace_id" int4 not null);');

    this.addSql('create table "message" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "text" text not null, "user_id" int4 not null, "workspace_id" int4 not null, "channel_id" int4 null);');

    this.addSql('create table "user_workspaces" ("user_id" int4 not null, "workspace_id" int4 not null);');
    this.addSql('alter table "user_workspaces" add constraint "user_workspaces_pkey" primary key ("user_id", "workspace_id");');

    this.addSql('create table "user_channels" ("user_id" int4 not null, "channel_id" int4 not null);');
    this.addSql('alter table "user_channels" add constraint "user_channels_pkey" primary key ("user_id", "channel_id");');

    this.addSql('alter table "workspace" add constraint "workspace_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "channel" add constraint "channel_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "channel" add constraint "channel_workspace_id_foreign" foreign key ("workspace_id") references "workspace" ("id") on update cascade;');

    this.addSql('alter table "message" add constraint "message_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "message" add constraint "message_workspace_id_foreign" foreign key ("workspace_id") references "workspace" ("id") on update cascade;');
    this.addSql('alter table "message" add constraint "message_channel_id_foreign" foreign key ("channel_id") references "channel" ("id") on update cascade on delete set null;');

    this.addSql('alter table "user_workspaces" add constraint "user_workspaces_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_workspaces" add constraint "user_workspaces_workspace_id_foreign" foreign key ("workspace_id") references "workspace" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "user_channels" add constraint "user_channels_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_channels" add constraint "user_channels_channel_id_foreign" foreign key ("channel_id") references "channel" ("id") on update cascade on delete cascade;');
  }

}
