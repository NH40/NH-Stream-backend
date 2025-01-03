import {
	Body,
	Head,
	Heading,
	Html,
	Link,
	Preview,
	Section,
	Tailwind,
	Text
} from '@react-email/components'
import * as React from 'react'

interface AccountDeletionTemplateProps {
	domain: string
}

export function AccountDeletionTemplate({ domain }:AccountDeletionTemplateProps) {
	const registerLink = `${domain}/account/create`

	return (
		<Html>
		    <Head />
	        <Preview>Аккаунт удалён</Preview>
	        <Tailwind>
		        <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
					<Section className="text-center">
						<Heading className="text-3xl text-black font-bold">
							Ваш аккаунт был полностью удалён
						</Heading>
						<Text className="text-base text-black mt-2">
							Ваш аккаунт был полностью стерт из базы данных NH Stream. Все ваши данные и информация были удалены безвозвратно.
						</Text>
					</Section>

					<Section className="bg-white text-black text-center rounded-lg shadow-md p-6 mb-4">
						<Text>
							Вы больше не будете получать уведомления в Telegram и на почту.
						</Text>
						<Text>
							Если вы захотите вернуться на платформу, вы можете зарегистрироваться по следующей ссылке:
						</Text>
						<Link
							href={registerLink}
							className="inline-flex justify-center items-center rounded-md mt-2 text-sm font-medium text-white bg-[#18B9AE] px-5 py-2 rounded-full"
						>
							Зарегистрироваться на NH Stream
						</Link>
					</Section>

					<Section className="text-center text-black">
						<Text>
							Спасибо, что были с нами! Мы всегда будем рады видеть вас на платформе.
						</Text>
					</Section>
		        </Body>
	        </Tailwind>
        </Html>
	)
}
