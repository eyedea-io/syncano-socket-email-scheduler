import Server from "syncano-server"

export default (ctx) => {
  const {socket} = new Server(ctx)

  socket.post('email-scheduler/schedule', {
    template: 'added-shareholder',
    interval: 60 * 24, // Remind every 24 hours
    data: {
      added_by: 'Kasper Mikiewicz',
      name: 'John Doe'
    }
  })
}
