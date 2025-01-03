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

export function VerifyChannelTemplate() {
	return (
		<Html>
		    <Head />
	        <Preview>Ваш канал верифицирован</Preview>
	        <Tailwind>
		        <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
					<Section className="text-center mb-8">
						<Heading className="text-3xl text-black font-bold">
							Поздравляем! Ваш канал верифицирован
						</Heading>
						<Text className="text-black text-base mt-2">
							Мы рады сообщить, что ваш канал теперь верифицирован, и вы получили официальный значок.
						</Text>
					</Section>

					<Section className="bg-white rounded-lg shadow-md p-6 text-center mb-6">
						<Heading className="text-2xl text-black font-semibold">
							Что это значит?
						</Heading>
						<Text className="text-base text-black mt-2">
							Значок верификации подтверждает подлинность вашего канала и улучшает доверие зрителей.
						</Text>
					</Section>

					<Section className="text-center mt-8">
						<Text className="text-gray-600">
							Если у вас есть вопросы, напишите нам на{' '}
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
