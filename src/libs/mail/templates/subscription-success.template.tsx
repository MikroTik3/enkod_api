import React from 'react'

import {
	Body,
	Button,
	Heading,
	Html,
	Tailwind,
	Text
} from '@react-email/components'
import {
	type Payment,
	type Subscription,
	type User
} from '@prisma/generated'

interface SubscriptionSuccessTemplateProps {
	user: User
	payment: Payment
	subscription: Subscription
}

const baseUrl = process.env['HOSTS_APP']

export function SubscriptionSuccessTemplate({
	user,
	payment,
	subscription
}: SubscriptionSuccessTemplateProps) {
	const coursesUrl = `${baseUrl}/courses`

	return (
		<Html>
			<Tailwind>
				<Body className="text-black">
					<Heading>Підписку активовано</Heading>

					<Text>
						Вітаємо, {user.displayName}! Дякуємо за оформлення
						преміум-підписки та підтримку Enkod.
					</Text>

					<Text>
						<strong>Спосіб оплати:</strong>{' '}
						Monobank
						<br />
						<strong>Сума:</strong> {(payment.amount / 100).toFixed(2)} грн
						<br />
						<strong>Початок підписки:</strong>{' '}
						{subscription.startedAt.toLocaleDateString('uk-UA')}
						<br />
						<strong>Закінчення підписки:</strong>{' '}
						{subscription.endedAt.toLocaleDateString('uk-UA') ?? subscription.nextChargeAt.toLocaleDateString('uk-UA')}
					</Text>

					<Button href={coursesUrl}>
						Перейти до курсів
					</Button>

					<Text>
						Вашу підписку успішно активовано. Тепер вам доступні всі
						матеріали платформи та можливість завантажувати код.
						Бажаємо приємного навчання!
					</Text>
				</Body>
			</Tailwind>
		</Html>
	)
}