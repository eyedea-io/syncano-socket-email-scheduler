import Server from 'syncano-server'

export default async ctx => {
  const {data, response} = new Server(ctx)
  const {token} = ctx.args

  try {
    const schedule = await data.scheduled_emails.where('token', token).firstOrFail()

    await data.scheduled_emails.update(schedule.id, {is_canceled: true})

    response.json({message: 'Email schedule was canceled.'})
  } catch (err) {
    response.json({message: 'Invalid token.'}, 400)
  }
}
