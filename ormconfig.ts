import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { User } from '@/user/user.entity';
import { Message } from '@/message/message.entity';

// TODO get from .env
export const ormconfig: PostgresConnectionOptions = {
  type: 'postgres',
  database: 'testDB',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  entities: [User, Message],
  synchronize: true,
};
