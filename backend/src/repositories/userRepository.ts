import { prisma } from '../config/prisma';
import { CreateUserInput, UpdateFcmTokenInput } from './types';

export const userRepository = {
  create(data: CreateUserInput) {
    return prisma.user.create({ data });
  },

  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findByUsername(username: string) {
    return prisma.user.findUnique({ where: { username } });
  },

  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  updateFcmToken({ id, fcmToken }: UpdateFcmTokenInput) {
    return prisma.user.update({ where: { id }, data: { fcmToken } });
  },
};
