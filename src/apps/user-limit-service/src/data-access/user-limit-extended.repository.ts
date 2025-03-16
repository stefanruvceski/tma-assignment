import { UserLimitRepository, UserLimit } from '@tma-monorepo/database';

// Showcase of extending the UserLimitRepository if needed
export class UserLimitExtendRepository extends UserLimitRepository {
  constructor() {
    super();
  }
  async findByBrandId(brandId: string): Promise<UserLimit[]> {
    const userLimit = await this.prisma.userLimit.findMany({
      where: { brandId },
    });
    return userLimit;
  }
}
