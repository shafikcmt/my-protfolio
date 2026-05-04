export async function sendEmailNotification(to: string, subject: string, body: string) {
  console.log('Email notification queued:', {
    to,
    subject,
    body,
    provider: process.env.EMAIL_PROVIDER || 'placeholder',
  })

  return {
    success: true,
    message: 'Email notification simulated in console. Replace with a real email provider implementation when ready.',
  }
}

export async function sendCourseNotification(email: string, courseTitle: string, type: 'enrollment' | 'completion') {
  const subject = type === 'completion' ? `Congratulations on completing ${courseTitle}` : `Enrollment confirmed: ${courseTitle}`
  const body = type === 'completion'
    ? `Great news! You have successfully completed ${courseTitle}. Your certificate is now available.`
    : `You are now enrolled in ${courseTitle}. Start learning at your convenience.`

  return sendEmailNotification(email, subject, body)
}
