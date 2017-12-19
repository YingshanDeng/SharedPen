'use strict'

class Utils {
  static assert (b, msg) {
    if (!b) {
      throw new Error(msg || 'assertion error')
    }
  }

  static makeEventEmitter (clazz, allowedEVents, context) {
    var self = context

    clazz.prototype._allowedEvents = allowedEVents
    // validate event
    clazz.prototype._validateEventType = (eventType) => {
      var allowed = false
      if (self._allowedEvents && self._allowedEvents.length) {
        allowed = self._allowedEvents.find((evt) => {
          return evt === eventType
        })
      }
      if (!allowed) {
        throw new Error('Unknown event "' + eventType + '"')
      }
    }
    // add event
    clazz.prototype.on = (eventType, callback, context) => {
      self._validateEventType(eventType)

      self._eventListeners = self._eventListeners || {}
      self._eventListeners[eventType] = self._eventListeners[eventType] || []
      self._eventListeners[eventType].push({
        callback: callback,
        context: context
      })
    }
    // remove event
    clazz.prototype.off = (eventType, callback) => {
      self._validateEventType(eventType)

      self._eventListeners = self._eventListeners || { }
      var listeners = self._eventListeners[eventType] || []
      for (var i = 0; i < listeners.length; i++) {
        if (listeners[i].callback === callback) {
          listeners.splice(i, 1)
          return
        }
      }
    }
    // trigger event
    clazz.prototype.trigger = (eventType) => {
      self._validateEventType(eventType)

      var listeners = self._eventListeners[eventType] || []
      for (var i = 0; i < listeners.length; i++) {
        var cb = listeners[i].callback
        cb && cb.apply(listeners[i].context, Array.prototype.slice.call(arguments, 1))
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

  static emptyAttributes (attrs) {
    for(var attr in attrs) {
      return false
    }
    return true
  }
}
