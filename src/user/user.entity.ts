import {
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Message } from '@/message/message.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  // TODO Save tokens in Session table
  @Column({ unique: true, nullable: true })
  refreshToken: string;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Message, (message) => message.id)
  messages: Message[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
