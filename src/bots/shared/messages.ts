import type { User } from '@prisma/generated'

export const MESSAGES = {
	botUnavailable: 'Гей-гей! Цей бот лише для власника, а не для тебе! 😜',
	welcomeMessage: `
    <b>Привіт, господарю!</b> 👋

Ви використовуєте бота <b>MN Climate</b>, який інформуватиме вас про нових користувачів на вашому сайті.

Бот готовий до роботи. Якщо з’являться нові користувачі — ви отримаєте сповіщення тут!
  `,
	newUser: (user: User, session: any, count: number) => `
🚨 <b>Новий користувач зареєструвався! 🎉</b>

<b>👤 Ім’я:</b> ${user.displayName}  
<b>📧 Email:</b> ${user.email}  

<b>🌍 Місцезнаходження:</b> ${session.geo.country}, ${session.geo.city}
<b>📱 Операційна система:</b> ${session.os.name}  
<b>🌐 Браузер:</b> ${session.browser.name}  
<b>💻 IP-адреса:</b> ${session.ip}

<b>🕒 Час реєстрації:</b> ${new Date().toLocaleString()}

<b>👨‍💻 Загальна кількість користувачів:</b> ${count}`
}
