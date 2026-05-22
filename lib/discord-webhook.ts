export async function sendDiscordNotification(
  title: string,
  description: string,
  color: number,
  fields?: Array<{
    name: string
    value: string
    inline?: boolean
  }>,
  mention?: string
) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL

  if (!webhookUrl) {
    console.warn('[v0] Discord webhook URL not configured')
    return
  }

  try {
    const embed = {
      title,
      description,
      color,
      fields: fields || [],
      timestamp: new Date().toISOString(),
    }

    const payload = {
      content: mention || '', // mention goes here
      embeds: [embed],
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      console.error(
        '[v0] Discord webhook error:',
        response.statusText
      )
    }
  } catch (error) {
    console.error(
      '[v0] Failed to send Discord notification:',
      error
    )
  }
}
