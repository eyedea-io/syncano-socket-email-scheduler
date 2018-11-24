import * as S from '@eyedea/syncano'

interface Args {
  token: string
}

class Endpoint extends S.Endpoint {
  async run(
    {response, data}: S.Core,
    {args}: S.Context<Args>
  ) {

    try {
      const schedule = await data.scheduled_emails.where('token', args.token).firstOrFail()
      await data.scheduled_emails.update(schedule.id, {is_canceled: true})
      response.json({message: 'Email schedule was canceled.'})
    } catch (err) {
      response.json({message: 'Invalid token.'}, 400)
    }
    response.json({})
  }

}

export default ctx => new Endpoint(ctx)
