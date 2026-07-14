import React from 'react'

import {
	Restriction,
	RestrictionReason,
	type User
} from '@prisma/generated'
import {
	Body,
	Heading,
	Html,
	Tailwind,
	Text
} from '@react-email/components'

interface RestrictionTemplateProps {
	user: User
	restriction: Restriction
	violations: number
}

export function RestrictionTemplate({
	user,
	restriction,
	violations
}: RestrictionTemplateProps) {
	const isUsernameBan =
		restriction.reason === RestrictionReason.INAPPROPRIATE_USERNAME

	const isPermanentBan = isUsernameBan || !restriction.until

	const remainingTime = isPermanentBan
		? 'безстроково'
		: `до ${new Date(restriction.until).toLocaleDateString('uk-UA', {
				timeZone: 'UTC'
			})}`

	const getReasonText = (reason: RestrictionReason) => {
		switch (reason) {
			case RestrictionReason.INAPPROPRIATE_USERNAME:
				return "неприйнятне ім'я користувача"
			case RestrictionReason.SPAM:
				return 'поширення спаму'
			case RestrictionReason.OFFENSIVE_BEHAVIOR:
				return 'неприйнятна поведінка'
			default:
				return 'невідома причина'
		}
	}

	return (
		<Html>
			<Tailwind>
				<Body className="text-black">
					<Heading>Ваш акаунт обмежено</Heading>

					<Text>
						Вітаємо, {user.displayName}. На жаль, на ваш акаунт було накладено
						обмеження через <strong>{getReasonText(restriction.reason)}</strong>.
					</Text>

					<Text>
						{isPermanentBan
							? 'Це обмеження є безстроковим.'
							: `Обмеження діятиме ${remainingTime}.`}
					</Text>

					{!isUsernameBan && violations === 0 && (
						<Text>
							Це ваше перше порушення. Якщо ви й надалі порушуватимете правила
							платформи, можуть бути застосовані суворіші санкції, зокрема
							тимчасове або безстрокове блокування акаунта.
						</Text>
					)}

					{!isUsernameBan && violations === 1 && (
						<Text>
							Це ваше друге порушення. Якщо ви ще раз порушите правила,
							ваш акаунт буде заблоковано безстроково.
						</Text>
					)}

					{!isUsernameBan && violations >= 2 && (
						<Text>
							Через неодноразове порушення правил ваш акаунт було
							заблоковано безстроково.
						</Text>
					)}

					<Text>
						Будь ласка, ознайомтеся з правилами платформи та дотримуйтеся їх
						надалі. Це допоможе уникнути подальших обмежень і зробить
						спільноту комфортною для всіх користувачів.
					</Text>
				</Body>
			</Tailwind>
		</Html>
	)
}