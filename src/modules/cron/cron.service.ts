import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { CRON_TIME } from '@/src/shared/constants/crontime.constant'

import { MailService } from '../libs/mail/mail.service'
import { StorageService } from '../libs/storage/storage.service'

@Injectable()
export class CronService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
		private readonly storageService: StorageService
	) {}

	// @Cron(CRON_TIME.EVERY_10_SECONDS) //10 секунд
	@Cron(CRON_TIME.DAILY_AT_MIDNIGHT) //каждую полночь
	public async deleteDeactivatedAccounts() {
		const sevenDaysAgo = new Date()

		sevenDaysAgo.setDate(sevenDaysAgo.getDay() - 7) // если аккаунт деактивирован 7 дней

		// sevenDaysAgo.setDate(sevenDaysAgo.getSeconds() - 10) //если аккаунт деактивирован 10 секунд

		const deactivatedAccounts = await this.prismaService.user.findMany({
			where: {
				isDeactivated: true,
				deactivatedAt: {
					lte: sevenDaysAgo
				}
			}
		})

		for (const user of deactivatedAccounts) {
			await this.mailService.sendAccountDeletion(user.email)

			if (user.avatar) {
				await this.storageService.remove(user.avatar)
			}
		}

		// console.log(`Deactivated accounts:`, deactivatedAccounts)

		await this.prismaService.user.deleteMany({
			where: {
				isDeactivated: true,
				deactivatedAt: {
					lte: sevenDaysAgo
				}
			}
		})
	}
}
