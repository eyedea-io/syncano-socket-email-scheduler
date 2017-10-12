import Server from 'syncano-server'

export default async ctx => {
  const {data, socket} = new Server(ctx)
  const {EMAIL_SENDER_ENDPOINT} = ctx.config
  const schedules = await data.scheduled_emails
    .where('is_canceled', false)
    .list()

  schedules.filter(isEmailScheduledToNow).forEach(schedule =>
    socket.post(EMAIL_SENDER_ENDPOINT, getData(schedule)).then(() =>
      data.scheduled_emails.where('token', schedule.token).update({
        triggered_at: new Date().toISOString(),
        sent_emails: schedule.sent_emails + 1
      })
    )
  )

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
