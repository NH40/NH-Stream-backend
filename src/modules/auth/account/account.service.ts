import { Injectable } from '@nestjs/common'
import { hash } from 'argon2'

import { PrismaService } from '@/src/core/prisma/prisma.service'

import { VerificationService } from '../verification/verification.service'

import { CreateUserInput } from './inputs/create-user.input'

@Injectable()
export class AccountService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly verificationService: VerificationService
	) {}

	public async me(id: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				id
			}
		})

		return user
	}

	public async create(input: CreateUserInput) {
		const { username, email, password } = input

		const isUserNameExists = await this.prismaService.user.findUnique({
			where: {
				username
			}
		})

		if (isUserNameExists) {
			throw new Error('Это имя пользователя уже занято')
		}

		const isEmailExists = await this.prismaService.user.findUnique({
			where: {
				email
			}
		})

		if (isEmailExists) {
			throw new Error('Пользователь с этим email уже зарегистрирован')
		}

		const user = await this.prismaService.user.create({
			data: {
				username,
				email,
				password: await hash(password),
				displayName: username
			}
		})

		await this.verificationService.sendVerificationToken(user)

		return true
	}
}
