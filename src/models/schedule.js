import {randomBytes} from 'crypto'

export default class Schedule {
  constructor({template, interval, payload}) {
    this.template = template
    this.interval = interval
    this.payload = payload
    this.token =  this._uuid()
    this.is_canceled =  false
    this.sent_emails =  0
    this.reminded_at = null
  }

  _uuid() {
    return randomBytes(16).toString('hex')
  }
}

