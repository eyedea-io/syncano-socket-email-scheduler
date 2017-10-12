import Server from 'syncano-server'

export default (ctx) => {
  const {socket} = new Server(ctx)

  socket.post(ctx.config.EMAIL_GENERATOR_ENDPOINT, ctx.args)
}
