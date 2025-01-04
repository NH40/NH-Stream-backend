import { BadRequestException, Injectable } from '@nestjs/common'
import { randomBytes } from 'crypto'
import { encode } from 'hi-base32'
import { TOTP } from 'otpauth'
import * as QRCode from 'qrcode'

import type { User } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { SITE_NAME } from '@/src/shared/constants/app.constants'

import { EnableTotpInput } from './inputs/enable-totp.input'

@Injectable()
export class TotpService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async generateSecret(user: User) {
		const secret = encode(randomBytes(15)).replace(/=/g, '').substring(0, 24)

		const totp = new TOTP({
			issuer: SITE_NAME,
			label: `${user.email}`,
			algorithm: 'SHA1',
			digits: 6,
			secret
		})

		const otpauthUrl = totp.toString()
		const qrcodeUrl = await QRCode.toDataURL(otpauthUrl)

		return { qrcodeUrl, secret }
	}

	public async enable(user: User, input: EnableTotpInput) {
		const { secret, pin } = input

		const totp = new TOTP({
			issuer: SITE_NAME,
			label: `${user.email}`,
			algorithm: 'SHA1',
			digits: 6,
			secret
		})

		const delta = totp.validate({ token: pin })

		if (delta === null) {
			throw new BadRequestException('Неверный код')
		}

		await this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				isTotpEnabled: true,
				totpSecret: secret
			}
		})

		return true
	}

	public async disable(user: User) {
		await this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				isTotpEnabled: false,
				totpSecret: null
			}
		})

		return true
	}
}
