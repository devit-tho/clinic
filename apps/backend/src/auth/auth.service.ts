import { Injectable, UnauthorizedException } from '@nestjs/common';
import { db } from '@repo/database';
import { PlaceOfBirth, UserWithoutPassword } from '@repo/entities';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly user: UserService) {}

  async validate(accessToken: string): Promise<UserWithoutPassword> {
    const resp = await db.token.findFirst({
      where: {
        token: accessToken,
      },
      select: {
        user: {
          include: {
            permission: {
              select: {
                id: true,
                values: true,
              },
            },
            _count: {
              select: {
                patients: true,
              },
            },
          },
          omit: { password: true },
        },
      },
    });

    if (!resp || !resp.user) throw new UnauthorizedException();

    return {
      ...resp.user,
      placeOfBirth: resp.user.placeOfBirth as PlaceOfBirth | null,
    };
  }
}
