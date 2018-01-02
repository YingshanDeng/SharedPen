'use strict'

module.exports =
class ClientSocketIOAdapter {
  constructor (socket) {
    this.socket = socket
    socket
      .on('client_join', (clientObj) => {
        this.trigger('client_join', clientObj)
      })
      .on('client_left', (clientId) => {
        this.trigger('client_left', clientId)
      })
      .on('set_name', (clientId, name) => {
        this.trigger('set_name', clientId, name)
      })
      .on('ack', () => {
        this.trigger('ack')
      })
      .on('operation', (clientId, operation, selection) => {
        this.trigger('operation', operation)
        this.trigger('selection', clientId, selection)
      })
      .on('selection', (clientId, selection) => {
        this.trigger('selection', clientId, selection)
      })
      .on('disconnect', (reason) => {
        this.trigger('disconnect', reason)
      })
      .on('reconnect', () => {
        this.trigger('reconnect')
      })
  }

  sendOperation (revision, operation, selection) {
    this.socket.emit('operation', revision, operation, selection)
  }
  sendSelection (selection) {
    this.socket.emit('selection', selection)
  }
  registerCallbacks (cbs) {
    this.callbacks = cbs
  }
  trigger (event, ...restArgs) {
    var action = this.callbacks && this.callbacks[event]
    if (action) {
      action.apply(this, restArgs)
    }
  }
}
