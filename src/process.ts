import * as S from '@eyedea/syncano'
import Schedule from './models/schedule'

interface Args {
  token: string
}

class Endpoint extends S.Endpoint {
  async run(
    {data, socket, logger}: S.Core,
    {config}: S.Context<Args>
  ) {

    const {debug} = logger('email-scheduler@process:')
    const {EMAIL_SENDER_ENDPOINT} = config
    const schedules = await data.scheduled_emails
      .where('is_canceled', false)
      .list()

    debug('start sending emails')

    schedules.filter(isEmailScheduledToNow).forEach(async schedule => {
      debug('start sending email', schedule.template)

      await socket
        .post(EMAIL_SENDER_ENDPOINT,  getData(schedule))
        .then(res => {
          debug('email sent')
          data.scheduled_emails.where('token', schedule.token).update({
            triggered_at: new Date().toISOString(),
            sent_emails: schedule.sent_emails + 1,
          })
        })
        .catch(err => {
          debug('failed to send email', err)
        })
    })
   /* ========================================================================== */

    function isEmailScheduledToNow (schedule: Schedule) {
      if (schedule.reminded_at === null) {
        return true
      }

      if (isPastReminder(schedule)) {
        return true
      }

      return false
  }

    function isPastReminder (schedule: Schedule) {
      const remindAt = new Date(schedule.triggered_at)
      remindAt.setMinutes(remindAt.getMinutes() + schedule.interval)

      return new Date().getTime() > remindAt.getTime()
  }

    function getData (schedule: Schedule) {
    return {
      to: schedule.to,
      payload: schedule.payload,
      template: schedule.template,
      token: schedule.token,
    }
  }

  }
}

export default ctx => new Endpoint(ctx)
