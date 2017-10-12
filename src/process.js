import Server from 'syncano-server'

export default async ctx => {
  const {data, socket, logger} = new Server(ctx)
  const {debug} = logger('email-scheduler@process:')
  const {EMAIL_SENDER_ENDPOINT} = ctx.config
  const schedules = await data.scheduled_emails
    .where('is_canceled', false)
    .list()

  debug('start sending emails')

  schedules.filter(isEmailScheduledToNow).forEach(schedule => {
    debug('start sending email', schedule.template)
    socket
      .post(EMAIL_SENDER_ENDPOINT, getData(schedule))
      .then(res => {
        debug('email sent')

        data.scheduled_emails.where('token', schedule.token).update({
          triggered_at: new Date().toISOString(),
          sent_emails: schedule.sent_emails + 1
        })
      })
      .catch(err => {
        debug('failed to send email', err)
      })
  })

  /* ========================================================================== */

  function isEmailScheduledToNow (schedule) {
    if (schedule.reminded_at === null) {
      return true
    }

    if (isPastReminder(schedule)) {
      return true
    }

    return false
  }

  function getData (schedule) {
    return {
      to: schedule.to,
      payload: schedule.payload,
      template: schedule.template,
      token: schedule.token
    }
  }

  function isPastReminder (schedule) {
    const remindAt = new Date(schedule.triggered_at)

    remindAt.setMinutes(remindAt.getMinutes() + schedule.interval)

    return new Date().getTime() > remindAt.getTime()
  }
}
