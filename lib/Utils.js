'use strict'

module.exports =
class Utils {
  static assert (b, msg) {
    if (!b) {
      throw new Error(msg || 'assertion error')
    }
  }
  // shallo object clone
  static shallowClone (source, target) {
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        target[key] = source[key]
      }
    }
  }
  // shallow object equal
  static shallowEqual (objA, objB) {
    var aAttrs = Object.getOwnPropertyNames(objA)
    var bAttrs = Object.getOwnPropertyNames(objB)

    if (aAttrs.length !== bAttrs.length) {
      return false
    }

    for (let attr of aAttrs) {
      if (objA[attr] !== objB[attr]) {
        return false
      }
    }
    return true
  }
  static cmpPos (a, b) {
    return (a.line - b.line) || (a.ch - b.ch)
  }
  static posEq (a, b) { return Utils.cmpPos(a, b) === 0 }
  static posLe (a, b) { return Utils.cmpPos(a, b) <= 0 }

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
      if (!self._eventListeners) { return }

      self._eventListeners = self._eventListeners || {}
      var listeners = self._eventListeners[eventType] || []
      for (var i = 0; i < listeners.length; i++) {
        if (listeners[i].callback === callback) {
          listeners.splice(i, 1)
          return
        }
      }
    }
    // trigger event
    clazz.prototype.trigger = (eventType, ...data) => {
      self._validateEventType(eventType)
      if (!self._eventListeners) { return }

      var listeners = self._eventListeners[eventType] || []
      for (var i = 0; i < listeners.length; i++) {
        var cb = listeners[i].callback
        cb && cb.apply(listeners[i].context, data)
      }
    }
  }

  // dynamic add css: wrap css in style then add to head
  static addStyleWithCSS (css) {
    if (!css && !css.length) { return }
    var style = document.createElement('style')
    style.type = 'text/css'
    style.appendChild(document.createTextNode(css))

    var head = document.documentElement.getElementsByTagName('head')[0]
    head.appendChild(style)
  }

  static emptyAttributes (attrs) {
    for (var attr in attrs) {
      return false
    }
    return true
  }
  // create custom element
  static elt (tag, content, attrs) {
    var ele = document.createElement(tag)
    if (typeof content === 'string') {
      ele.innerHTML = ''
      ele.appendChild(document.createTextNode(content))
    } else if (content && content instanceof Array) {
      for (let i = 0; i < content.length; i++) {
        ele.appendChild(content[i])
      }
    }

    for (var attr in (attrs || { })) {
      ele.setAttribute(attr, attrs[attr])
    }
    return ele
  }

  static on (emitter, type, f, capture) {
    if (emitter.addEventListener) {
      emitter.addEventListener(type, f, capture || false)
    } else if (emitter.attachEvent) {
      emitter.attachEvent('on' + type, f)
    }
  }
  static off (emitter, type, f, capture) {
    if (emitter.removeEventListener) {
      emitter.removeEventListener(type, f, capture || false)
    } else if (emitter.detachEvent) {
      emitter.detachEvent('on' + type, f)
    }
  }
  static preventDefault (e) {
    if (e.preventDefault) {
      e.preventDefault()
    } else {
      e.returnValue = false
    }
  }
  static stopPropagation (e) {
    if (e.stopPropagation) {
      e.stopPropagation()
    } else {
      e.cancelBubble = true
    }
  }
  static stopEvent (e) {
    Utils.preventDefault(e)
    Utils.stopPropagation(e)
  }
  static stopEventAnd (fn) {
    return function (e) {
      fn(e)
      Utils.stopEvent(e)
      return false
    }
  }
  static hueFromName (name) {
    var a = 1
    for (var i = 0; i < name.length; i++) {
      a = 17 * (a + name.charCodeAt(i)) % 360
    }
    return a / 360
  }
  static hsl2hex (h, s, l) {
    var rgb2hex = function (r, g, b) {
      function digits (n) {
        var m = Math.round(255 * n).toString(16)
        return m.length === 1 ? '0' + m : m
      }
      return '#' + digits(r) + digits(g) + digits(b)
    }

    if (s === 0) {
      return rgb2hex(l, l, l)
    }
    var var2 = l < 0.5 ? l * (1 + s) : (l + s) - (s * l)
    var var1 = 2 * l - var2

    var hue2rgb = function (hue) {
      if (hue < 0) { hue += 1 }
      if (hue > 1) { hue -= 1 }
      if (6 * hue < 1) { return var1 + (var2 - var1) * 6 * hue }
      if (2 * hue < 1) { return var2 }
      if (3 * hue < 2) { return var1 + (var2 - var1) * 6 * (2 / 3 - hue) }
      return var1
    }

    return rgb2hex(hue2rgb(h + 1 / 3), hue2rgb(h), hue2rgb(h - 1 / 3))
  }
}
