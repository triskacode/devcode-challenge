import { MigrationInterface, QueryRunner } from "typeorm";

export class base1665133199953 implements MigrationInterface {
    name = 'base1665133199953'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`todos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`priority\` enum ('very-high', 'high', 'normal', 'low', 'very-low') NOT NULL DEFAULT 'very-high', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`activity_group_id\` int NOT NULL, INDEX \`IDX_73ef6e8f84da3fd84725eb3b93\` (\`activity_group_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`activities\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`title\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, INDEX \`IDX_d58fababca5a5a89ddb4522881\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`todos\` ADD CONSTRAINT \`FK_73ef6e8f84da3fd84725eb3b93c\` FOREIGN KEY (\`activity_group_id\`) REFERENCES \`activities\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`todos\` DROP FOREIGN KEY \`FK_73ef6e8f84da3fd84725eb3b93c\``);
        await queryRunner.query(`DROP INDEX \`IDX_d58fababca5a5a89ddb4522881\` ON \`activities\``);
        await queryRunner.query(`DROP TABLE \`activities\``);
        await queryRunner.query(`DROP INDEX \`IDX_73ef6e8f84da3fd84725eb3b93\` ON \`todos\``);
        await queryRunner.query(`DROP TABLE \`todos\``);
    }

}
