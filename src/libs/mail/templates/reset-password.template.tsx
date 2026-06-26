import React from 'react'

import type { User } from '@prisma/generated'
import {
	Body,
	Button,
	Container,
	Font,
	Head,
	Heading,
	Html,
	Preview,
	Section,
	Tailwind,
	Text
} from '@react-email/components'

interface ResetPasswordTemplateProps {
	user: User
	token: string
}

const baseUrl = process.env['HOSTS_APP']

export function ResetPasswordTemplate({ user, token }: ResetPasswordTemplateProps) {
	const resetLink = `${baseUrl}auth/recovery/${token}`

	return (
		<Html>
			<Head>
				<Font
					fontFamily='Geist'
					fallbackFontFamily='Arial'
					webFont={{
						url: 'https://fonts.googleapis.com/css2?family=Geist:wght@300;500;700&display=swap',
						format: 'woff2'
					}}
				/>
			</Head>
			<Tailwind>
				<Body>
					<Preview>Скидання пароля на Enkod</Preview>
					<Container className='mx-auto my-10 max-w-[500px] rounded-lg bg-white p-8 shadow-lg'>
						<Section className='text-center'>
							<Heading className='text-2xl font-bold text-blue-600' style={{ fontFamily: 'Geist, Arial' }}>
								Скидання пароля
							</Heading>
							<Text className='mb-6 text-gray-500' style={{ fontFamily: 'Geist, Arial' }}>
								Привіт, {user.username}! Ми отримали запит на скидання пароля для вашого акаунта.
							</Text>
							<Section className='mb-8 rounded-lg border border-blue-100 bg-blue-50 p-6'>
								<Text className='mb-4 text-gray-800' style={{ fontFamily: 'Geist, Arial' }}>
								Натисніть на кнопку нижче, щоб створити новий пароль. Посилання дійсне протягом 1 години.
								</Text>
								<Button
									href={resetLink}
									className='inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3 text-sm font-medium text-white hover:bg-blue-600/90 leading-none'
									style={{ fontFamily: 'Geist, Arial' }}
								>
									Скинути пароль
								</Button>
							</Section>
							<Text className='text-sm text-gray-500' style={{ fontFamily: 'Geist, Arial' }}>
								Якщо ви не запитували скидання пароля, просто проігноруйте цей лист.
							</Text>
							<Text className='mt-6 text-sm text-gray-400' style={{ fontFamily: 'Geist, Arial' }}>
								© {new Date().getFullYear()} Enkod. Всі права захищені.
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}