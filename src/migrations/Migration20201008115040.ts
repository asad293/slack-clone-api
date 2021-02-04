import { Migration } from '@mikro-orm/migrations';

export class Migration20201008115040 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "token" text null;');
  }

}
