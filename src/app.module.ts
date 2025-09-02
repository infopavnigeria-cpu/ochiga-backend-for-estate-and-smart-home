@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Estate, Home, Room, User, HomeMember],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Estate, Home, Room, User, HomeMember]),
  ],
})
})
export class AppModule {}
