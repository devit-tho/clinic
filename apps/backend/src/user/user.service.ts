import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { db } from '@repo/database';
// import {
//   ChangePasswordDto,
//   CreateUserDto,
//   LoginUserDto,
//   PermissionDto,
//   ResetPasswordDto,
//   UpdateUserDto,
// } from '@repo/dto';
import {
  excludeFields,
  LoginResponse,
  PlaceOfBirth,
  UserPermission,
  UserResponse,
  UserWithoutPassword,
} from '@repo/entities';
import * as bcrypt from 'bcryptjs';
import { Request } from 'express';
import * as generator from 'generate-password';
import {
  ChangePasswordDto,
  CreateUserDto,
  LoginUserDto,
  PermissionDto,
  ResetPasswordDto,
  UpdateUserDto,
} from './user.dto';

export function encryptPassword(password: string) {
  return bcrypt.hashSync(password, 8);
}

export function comparePassword(password: string, hashPassword: string) {
  return bcrypt.compareSync(password, hashPassword);
}

@Injectable()
export class UserService {
  constructor(
    private readonly jwt: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async getAll(): Promise<UserWithoutPassword[]> {
    const resp = await db.user.findMany({
      where: { isDeleted: false },
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
      omit: { ...excludeFields, password: true },
    });

    return resp.map((d) => ({
      ...d,
      placeOfBirth: d.placeOfBirth as PlaceOfBirth | null,
    }));
  }

  async getById(id: string): Promise<UserWithoutPassword> {
    const user = await db.user.findUnique({
      where: {
        id,
      },
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
      omit: {
        ...excludeFields,
        password: true,
      },
    });

    if (!user) throw new NotFoundException();

    return {
      ...user,
      placeOfBirth: user.placeOfBirth as PlaceOfBirth | null,
    };
  }

  async generateToken(id: string) {
    return this.jwt.sign(
      { id },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRES_IN'),
      },
    );
  }

  async generateUsername(role: Role = Role.STAFF) {
    if (role === Role.STAFF) {
      const staffCount = await db.user.count({ where: { role } });

      return `S${String(staffCount + 1).padStart(4, '0')}`;
    }

    const doctorCount = await db.user.count({
      where: {
        OR: [{ role: Role.DOCTOR }, { role: Role.ADMIN }],
      },
    });

    return `D${String(doctorCount + 1).padStart(4, '0')}`;
  }

  async login(dto: LoginUserDto): Promise<LoginResponse> {
    const curUser = await db.user.findFirst({
      where: {
        username: dto.username,
      },
      select: {
        id: true,
        password: true,
      },
    });

    if (!curUser) {
      throw new UnauthorizedException('Incorrect username or password');
    }

    const isMatch = bcrypt.compareSync(dto.password, curUser.password);

    if (!isMatch || !curUser) {
      throw new UnauthorizedException('Incorrect username or password');
    }

    const token = await this.generateToken(curUser.id);

    const createdToken = await db.token.create({
      data: {
        token,
        userId: curUser.id,
        device: dto.device,
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
          omit: {
            password: true,
            ...excludeFields,
          },
        },
      },
    });

    return {
      token,
      user: {
        ...createdToken.user,
        placeOfBirth: createdToken.user.placeOfBirth as PlaceOfBirth | null,
      },
    };
  }

  async create(dto: CreateUserDto): Promise<UserResponse> {
    const isNotManualPassword = !dto.password.length;
    let password: string;
    const generatePassword = generator.generate({ length: 8 });

    if (isNotManualPassword) {
      password = encryptPassword(generatePassword);
    } else {
      password = encryptPassword(dto.password);
    }

    const user = await db.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        alias: `${dto.firstName} ${dto.lastName}`,
        username: await this.generateUsername(dto.role),
        password,
        dateOfBirth: dto.dateOfBirth,
        role: dto.role,
        placeOfBirth: dto.placeOfBirth,
        email: dto.email,
        gender: dto.gender,
        phoneNumber: dto.phoneNumber,
        imageUrl: dto.imageUrl,
        createdAt: new Date(),
        // createdBy: '',
        permission: {
          create: {},
        },
      },
      omit: {
        password: true,
        ...excludeFields,
      },
    });

    return {
      username: user.username,
      password: isNotManualPassword ? generatePassword : dto.password,
    };
  }

  async update(req: Request, dto: UpdateUserDto) {
    await db.user.update({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        alias: `${dto.firstName} ${dto.lastName}`,
        dateOfBirth: dto.dateOfBirth,
        role: dto.role,
        placeOfBirth: dto.placeOfBirth,
        email: dto.email,
        gender: dto.gender,
        phoneNumber: dto.phoneNumber,
        imageUrl: dto.imageUrl,
        updatedAt: new Date(),
        updatedBy: req.user.id,
        permission: {
          create: {},
        },
      },
      where: {
        id: req.user.id,
      },
    });
  }

  async updateCurrentUser(curUser: UserWithoutPassword, dto: UpdateUserDto) {
    const user = await db.user.findUnique({
      where: {
        id: curUser.id,
      },
    });

    if (!user) throw new NotFoundException();

    return db.user.update({
      data: {
        ...dto,
        alias: `${dto.firstName} ${dto.lastName}`,
      },
      where: {
        id: user.id,
      },
    });
  }

  async getPermission(id: string): Promise<UserPermission> {
    const permission = await db.permission.findFirst({
      where: {
        userId: id,
      },
      select: {
        id: true,
        user: {
          select: {
            alias: true,
          },
        },
        values: true,
      },
    });

    if (!permission) throw new NotFoundException();

    return permission;
  }

  async updatePermission(userId: string, id: string, dto: PermissionDto) {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundException();

    const permission = await db.permission.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!permission) throw new NotFoundException();

    await db.permission.update({
      where: {
        id,
        userId,
      },
      data: {
        values: dto.values,
      },
    });
  }

  async deleteUser(curUser: UserWithoutPassword, id: string) {
    const user = await db.user.findFirst({
      where: {
        id,
      },
      select: {
        permission: {
          select: {
            id: true,
          },
        },
        role: true,
      },
    });

    if (!user) throw new NotFoundException();

    if (user.role === Role.ADMIN) {
      throw new BadRequestException('Admin cannot delete');
    }

    await db.user.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: curUser.id,
        permission: {
          update: {
            isDeleted: true,
          },
        },
      },
    });
  }

  async changePassword(curUser: UserWithoutPassword, dto: ChangePasswordDto) {
    const user = await db.user.findUnique({
      where: {
        id: curUser.id,
      },
      select: {
        password: true,
      },
    });

    if (!user) throw new NotFoundException();

    const currentMatched = comparePassword(dto.currentPassword, user.password);

    if (!currentMatched) {
      throw new BadRequestException('Current password is incorrect');
    }

    const newPasswordMatched = dto.newPassword === dto.confirmPassword;

    if (!newPasswordMatched) {
      throw new BadRequestException(
        'New password and confirm password are not matched',
      );
    }

    const encryptedNewPassword = encryptPassword(dto.newPassword);

    await db.user.update({
      where: {
        id: curUser.id,
      },
      data: {
        password: encryptedNewPassword,
      },
    });
  }

  async resetPassword(req: Request, id: string, dto: ResetPasswordDto) {
    const user = await db.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const encryptedNewPassword = encryptPassword(dto.password);

    await db.user.update({
      where: {
        id: user.id,
        updatedAt: new Date(),
        updatedBy: req.user.id,
      },
      data: {
        password: encryptedNewPassword,
      },
    });
  }

  async logout(id: string, token: string) {
    await db.token.update({
      data: {
        isDeleted: true,
      },
      where: {
        token,
        userId: id,
      },
    });
  }
}
