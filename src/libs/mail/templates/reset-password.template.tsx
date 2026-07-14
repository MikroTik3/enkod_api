import React from 'react'

import type { User } from '@prisma/generated'
import {
	Body,
	Heading,
	Html,
	Link,
	Tailwind,
	Text
} from '@react-email/components'

interface ResetPasswordTemplateProps {
	user: User
	token: string
}

const baseUrl = process.env['HOSTS_APP']

export function ResetPasswordTemplate({
	user,
	token
}: ResetPasswordTemplateProps) {
	const resetLink = `${baseUrl}auth/recovery/${token}`

	return (
		<Html>
			<Tailwind>
				<Body className="text-black">
					<Heading>Скидання пароля</Heading>

					<Text>
						Вітаємо, {user.displayName}! Ви надіслали запит на скидання пароля.
						Будь ласка, перейдіть за посиланням нижче, щоб створити новий пароль.
					</Text>

					<Link href={resetLink}>Скинути пароль</Link>

					<Text>
						Це посилання дійсне протягом 1 години. Якщо ви не надсилали
						запит на скидання пароля, просто проігноруйте цей лист.
					</Text>
				</Body>
			</Tailwind>
		</Html>
	)
}