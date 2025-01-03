import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import type { Request } from 'express'

import { TokenType, User } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { generateToken } from '@/src/shared/utils/generate-token.util'
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util'
import { saveSession } from '@/src/shared/utils/session.util'

import { MailService } from '../../libs/mail/mail.service'

import { VerificationInput } from './inputs/verification.input'

@Injectable()
export class VerificationService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService
	) {}

	public async verify(
		req: Request,
		input: VerificationInput,
		userAgent: string
	) {
		const { token } = input

		const existingToken = await this.prismaService.token.findFirst({
			where: { token, type: TokenType.EMAIL_VERIFICATION }
		})

		if (!existingToken) {
			throw new NotFoundException('Токен не найден')
		}

		const hasExpired = new Date(existingToken.expiresIn) < new Date()

		if (hasExpired) {
			throw new BadRequestException('Токен истёк')
		}

		const user = await this.prismaService.user.update({
			where: { id: existingToken.userId },
			data: {
				isEmailVerified: true
			}
		})

		await this.prismaService.token.delete({
			where: { id: existingToken.id, type: TokenType.EMAIL_VERIFICATION }
		})

		const metadata = getSessionMetadata(req, userAgent)

		return saveSession(req, user, metadata)
	}

	public async sendVerificationToken(user: User) {
		const verificationToken = await generateToken(
			this.prismaService,
			user,
			TokenType.EMAIL_VERIFICATION
		)

		await this.mailService.sendVerificationToken(
			user.email,
			verificationToken.token
		)

		return true
	}
}
