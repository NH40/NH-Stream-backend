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

interface EnableTwoFactorTemplateProps {
	domain: string
}

export function EnableTwoFactorTemplate({ domain }: EnableTwoFactorTemplateProps) {
	const settingsLink = `${domain}/dashboard/settings`

	return (
		<Html>
		    <Head />
	        <Preview>Обеспечьте свою безопасность</Preview>
	        <Tailwind>
		        <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
					<Section className="text-center mb-8">
						<Heading className="text-3xl text-black font-bold">
							Защитите свой аккаунт с двухфакторной аутентификацией
						</Heading>
						<Text className="text-black text-base mt-2">
							Включите двухфакторную аутентификацию, чтобы повысить безопасность вашего аккаунта.
						</Text>
					</Section>

					<Section className="bg-white rounded-lg shadow-md p-6 text-center mb-6">
						<Heading className="text-2xl text-black font-semibold">
							Почему это важно?
						</Heading>
						<Text className="text-base text-black mt-2">
							Двухфакторная аутентификация добавляет дополнительный уровень защиты, требуя код, который известен только вам.
						</Text>
						<Link
							href={settingsLink}
							className="inline-flex justify-center items-center rounded-md text-sm font-medium text-white bg-[#18B9AE] px-5 py-2 rounded-full"
						>
							Перейти в настройки аккаунта
						</Link>
					</Section>

					<Section className="text-center mt-8">
						<Text className="text-gray-600">
							Если у вас возникли вопросы, обращайтесь в службу поддержки по адресу{' '}
							<Link
								href="mailto:help@nhstream.ru"
								className="text-[#18b9ae] underline"
							>
								help@nhstream.ru
							</Link>.
						</Text>
					</Section>
		        </Body>
	        </Tailwind>
        </Html>
	)
}
