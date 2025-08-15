async create(userId: number, createRoomDto: CreateRoomDto) {
  // Validate ownership before creating
  await this.homeService.findOne(userId, createRoomDto.homeId);

  const room = this.roomRepository.create(createRoomDto);
  return this.roomRepository.save(room);
}

async update(userId: number, id: number, updateRoomDto: UpdateRoomDto) {
  const index = await this.findIndexById(id);

  // Validate ownership before updating
  await this.homeService.findOne(userId, this.rooms[index].homeId);

  Object.assign(this.rooms[index], updateRoomDto);
  return this.roomRepository.save(this.rooms[index]);
}
