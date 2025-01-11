import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { CRON_TIME } from '@/src/shared/constants/crontime.constant'

import { MailService } from '../libs/mail/mail.service'
import { StorageService } from '../libs/storage/storage.service'
import { TelegramService } from '../libs/telegram/telegram.service'
import { NotificationService } from '../notification/notification.service'

@Injectable()
export class CronService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
		private readonly notificationService: NotificationService,
		private readonly telegramService: TelegramService,
		private readonly storageService: StorageService
	) {}

	// @Cron(CRON_TIME.EVERY_10_SECONDS) //10 секунд
	@Cron(CRON_TIME.DAILY_AT_MIDNIGHT) //каждую полночь
	public async deleteDeactivatedAccounts() {
		const sevenDaysAgo = new Date()
		sevenDaysAgo.setDate(sevenDaysAgo.getSeconds() - 10)

		const deactivatedAccounts = await this.prismaService.user.findMany({
			where: {
				isDeactivated: true,
				deactivatedAt: {
					lte: sevenDaysAgo
				}
			},
			include: {
				notificationSettings: true,
				stream: true
			}
		})

		for (const user of deactivatedAccounts) {
			await this.mailService.sendAccountDeletion(user.email)

			if (user.notificationSettings.telegramNotifications && user.telegramId) {
				await this.telegramService.sendAccountDeletion(user.telegramId)
			}

			if (user.avatar) {
				this.storageService.remove(user.avatar)
			}

			if (user.stream.thumbnailUrl) {
				this.storageService.remove(user.stream.thumbnailUrl)
			}
		}

		await this.prismaService.user.deleteMany({
			where: {
				isDeactivated: true,
				deactivatedAt: {
					lte: sevenDaysAgo
				}
			}
		})
	}

	@Cron('0 0 */4 * *')
	public async notifyUsersEnableTwoFactor() {
		const users = await this.prismaService.user.findMany({
			where: {
				isTotpEnabled: false
			},
			include: {
				notificationSettings: true
			}
		})

		for (const user of users) {
			await this.mailService.sendEnableTwoFactor(user.email)

			if (user.notificationSettings.siteNotifications) {
				await this.notificationService.createEnableTwoFactor(user.id)
			}

			if (user.notificationSettings.telegramNotifications && user.telegramId) {
				await this.telegramService.sendEnableTwoFactor(user.telegramId)
			}
		}
	}

	@Cron(CRON_TIME.EVERY_DAY_AT_1AM)
	public async verifyChannels() {
		const users = await this.prismaService.user.findMany({
			include: {
				notificationSettings: true
			}
		})

		for (const user of users) {
			const followersCount = await this.prismaService.follow.count({
				where: {
					followingId: user.id
				}
			})

			if (followersCount > 10 && !user.isVerified) {
				await this.prismaService.user.update({
					where: {
						id: user.id
					},
					data: {
						isVerified: true
					}
				})

				await this.mailService.sendVerifyChannel(user.email)

				if (user.notificationSettings.siteNotifications) {
					await this.notificationService.createVerifyChannel(user.id)
				}

				if (
					user.notificationSettings.telegramNotifications &&
					user.telegramId
				) {
					await this.telegramService.sendVerifyChannel(user.telegramId)
				}
			}
		}
	}

	@Cron(CRON_TIME.EVERY_DAY_AT_1AM)
	public async deleteOldNotifications() {
		const sevenDaysAgo = new Date()
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

		await this.prismaService.notification.deleteMany({
			where: {
				createdAt: {
					lte: sevenDaysAgo
				}
			}
		})
	}
}
