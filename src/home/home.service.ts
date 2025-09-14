/// src/home/home.service.ts
private async ensureMembership(userId: string, homeId: string) {
  const member = await this.memberRepo.findOne({
    where: { user: { id: userId }, home: { id: homeId as string } }, // enforce string
    relations: ['home'],
  });

  if (!member) {
    throw new ForbiddenException('You are not a member of this home');
  }
  return member;
}

async findOne(userId: string, id: string) {
  await this.ensureMembership(userId, id);

  const home = await this.homeRepo.findOne({ where: { id: id as string } }); // enforce string
  if (!home) throw new NotFoundException('Home not found');
  return home;
}

async update(userId: string, id: string, dto: UpdateHomeDto) {
  const member = await this.ensureMembership(userId, id);
  if (member.role !== HomeRole.OWNER && member.role !== HomeRole.ADMIN) {
    throw new ForbiddenException('Only admins can update this home');
  }

  Object.assign(member.home, dto);
  return this.homeRepo.save(member.home);
}

async remove(userId: string, id: string) {
  const member = await this.ensureMembership(userId, id);
  if (member.role !== HomeRole.OWNER) {
    throw new ForbiddenException('Only the OWNER can delete this home');
  }

  return this.homeRepo.remove(member.home);
}
