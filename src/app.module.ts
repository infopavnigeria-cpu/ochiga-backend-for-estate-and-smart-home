import { Estate } from './estate/entities/estate.entity';
import { Home } from './home/entities/home.entity';
import { Room } from './room/entities/room.entity';
import { User } from './user/entities/user.entity';
import { HomeMember } from './home/entities/home-member.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite', // or postgres
      database: 'db.sqlite',
      entities: [Estate, Home, Room, User, HomeMember],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Estate, Home, Room, User, HomeMember]),
  ],
})
