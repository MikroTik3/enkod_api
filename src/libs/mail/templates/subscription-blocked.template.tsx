import React from 'react'

import {
	Body,
	Button,
	Heading,
	Html,
	Tailwind,
	Text
} from '@react-email/components'
import { Payment, User } from '@prisma/generated'

interface SubscriptionBlockedTemplateProps {
	user: User
	payment: Payment
	payUrl: string
}

export function SubscriptionBlockedTemplate({
	user,
	payment,
	payUrl
}: SubscriptionBlockedTemplateProps) {
	return (
		<Html>
			<Tailwind>
				<Body className="text-black">
					<Heading>Підписку призупинено</Heading>

					<Text>
						Вітаємо, {user.displayName}! Вашу підписку було тимчасово
						призупинено, оскільки автоматичне списання коштів було
						вимкнено або платіж не пройшов.
					</Text>

					<Text>
						Щоб відновити доступ до всіх матеріалів і можливість
						завантажувати код, будь ласка, оплатіть рахунок.
					</Text>

					<Text>
						<strong>Сума:</strong> {(payment.amount / 100).toFixed(2)} грн
						<br />
						<strong>Спосіб оплати:</strong>{' '}
						Monobank
						<br />
					</Text>

					<Button href={payUrl}>Оплатити рахунок</Button>

					<Text>
						Після успішної оплати ваша підписка буде автоматично
						відновлена, і ви знову отримаєте повний доступ до платформи.
					</Text>
				</Body>
			</Tailwind>
		</Html>
	)
}