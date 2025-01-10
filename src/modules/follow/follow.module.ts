import { Module } from '@nestjs/common'

import { TelegramService } from '../libs/telegram/telegram.service'
import { NotificationService } from '../notification/notification.service'

import { FollowResolver } from './follow.resolver'
import { FollowService } from './follow.service'

@Module({
	providers: [
		FollowResolver,
		FollowService,
		NotificationService,
		TelegramService
	]
})
export class FollowModule {}
