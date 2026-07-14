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

interface EmailVerificationTemplateProps {
	user: User
	token: string
}

const baseUrl = process.env['HOSTS_APP']

export function EmailVerificationTemplate({
	user,
	token
}: EmailVerificationTemplateProps) {
	const verifyLink = `${baseUrl}auth/verify/${token}`

	return (
		<Html>
			<Tailwind>
				<Body className="text-black">
					<Heading>Підтвердження електронної пошти</Heading>

					<Text>
						Вітаємо, {user.displayName}! Щоб підтвердити свою електронну
						пошту, будь ласка, перейдіть за посиланням нижче.
					</Text>

					<Link href={verifyLink}>Підтвердити електронну пошту</Link>

					<Text>
						Це посилання дійсне протягом 1 години. Якщо ви не надсилали
						запит на підтвердження електронної пошти, просто проігноруйте
						цей лист.
					</Text>
				</Body>
			</Tailwind>
		</Html>
	)
}