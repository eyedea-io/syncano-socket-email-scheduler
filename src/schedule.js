import Server from 'syncano-server'
import Schedule from './models/schedule'

export default async ctx => {
  const {data, socket, response} = new Server(ctx)
  const schedule = new Schedule(ctx.args)

  await data.scheduled_emails.create(schedule)

  response.json({
    token: schedule.token
  })
}
