import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Activity } from 'src/modules/activity/entities/activity.entity';
import { Todo } from 'src/modules/todo/entities/todo.entity';

config();

export default new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: +process.env.MYSQL_PORT,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DBNAME,
  entities: [Activity, Todo],
  migrations: [__dirname + '/src/migrations/*.{js,ts}'],
});
