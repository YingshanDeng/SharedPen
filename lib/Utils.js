'use strict'

class Utils {
  static assert (b, msg) {
    if (!b) {
      throw new Error(msg || 'assertion error')
    }
  }

  static makeEventEmitter (clazz, allowedEVents) {
    clazz.prototype._allowedEvents = allowedEVents
    // validate event
    clazz.prototype._validateEventType = (eventType) => {
      var allowed = false
      if (this._allowedEvents && this._allowedEvents.length) {
        allowed = this._allowedEvents.find((evt) => {
          return evt === eventType
        })
      }
      if (!allowed) {
        throw new Error('Unknown event "' + eventType + '"')
      }
    }
    // add event
    clazz.prototype.on = (eventType, callback, context) => {
      this._validateEventType(eventType)

      this._eventListeners = this._eventListeners || {}
      this._eventListeners[eventType] = this._eventListeners[eventType] || []
      this._eventListeners[eventType].push({
        callback: callback,
        context: context
      })
    }
    // remove event
    clazz.prototype.off = (eventType, callback) => {
      this._validateEventType(eventType)

      this._eventListeners = this._eventListeners || { }
      var listeners = this._eventListeners[eventType] || []
      for (var i = 0; i < listeners.length; i++) {
        if (listeners[i].callback === callback) {
          listeners.splice(i, 1)
          return
        }
      }
    }
    // trigger event
    clazz.prototype.trigger = (eventType) => {
      this._validateEventType(eventType)

      var listeners = this._eventListeners[eventType] || []
      for (var i = 0; i < listeners.length; i++) {
        listeners[i].callback.apply(listeners[i].context, Array.prototype.slice.call(arguments, 1))
      }
    }
  }

  // dynamic add css: wrap css in style then add to head
  static addStyleWithCSS (css) {
    if (!css && !css.length) { return }
    var head = document.getElementsByTagName('head')[0]
    var style = document.createElement('style')
    style.type = 'text/css'
    style.appendChild(document.createTextNode(css))
    head.appendChild(style)
  }
}

export default Utils
