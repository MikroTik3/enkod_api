import React from 'react'

import type { User } from '@prisma/generated'
import {
	Body,
	Heading,
	Html,
	Tailwind,
	Text
} from '@react-email/components'

interface RestrictionLiftedTemplateProps {
	user: User
	violations: number
}

export function RestrictionLiftedTemplate({
	user,
	violations
}: RestrictionLiftedTemplateProps) {
	const remainingViolations = Math.max(0, 3 - violations)

	const getViolationText = (count: number) => {
		if (count === 1) return 'порушення'
		if (count > 1 && count < 5) return 'порушення'
		return 'порушень'
	}

	return (
		<Html>
			<Tailwind>
				<Body className="text-black">
					<Heading>Обмеження знято</Heading>

					<Text>
						Вітаємо, {user.displayName}! Раді повідомити, що обмеження на вашому акаунті було знято.
					</Text>

					{violations === 0 && (
						<Text>
							Це було ваше перше порушення. Якщо надалі ви порушуватимете
							правила платформи, можуть бути застосовані суворіші санкції,
							зокрема тимчасове або безстрокове блокування акаунта.
						</Text>
					)}

					{remainingViolations > 0 && (
						<>
							<Text>
								Після зняття обмеження у вас залишилося{' '}
								{remainingViolations} {getViolationText(remainingViolations)}
								{' '}до безстрокового блокування акаунта.
							</Text>

							<Text>
								Будь ласка, дотримуйтеся правил платформи, щоб уникнути
								подальших санкцій.
							</Text>
						</>
					)}

					{remainingViolations === 0 && (
						<Text>
							Це ваш останній шанс уникнути безстрокового блокування акаунта.
							Будь ласка, дотримуйтеся правил платформи.
						</Text>
					)}

					<Text>
						Ваш акаунт знову активний. Дякуємо, що залишаєтеся частиною
						спільноти Enkod!
					</Text>
				</Body>
			</Tailwind>
		</Html>
	)
}