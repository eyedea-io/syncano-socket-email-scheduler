import * as S from '@eyedea/syncano'
import Schedule from './models/schedule'

interface Args {
  schedule: Schedule
}
class Endpoint extends S.Endpoint {
  async run(
    {data, response}: S.Core,
    {args}: S.Context<Args>
  ) {
    await data.scheduled_emails.create(args.schedule)

    response.json({
      token: args.schedule.token,
    })
  }
}

export default ctx => new Endpoint(ctx)
