'use strict'
const Utils = require('./Utils.js')

module.exports =
class TextAction {
  // Operation are essentially lists of ops. There are three types of ops:
  //
  // * Retain ops: Advance the cursor position by a given number of characters.
  //   Represented by positive ints.
  // * Insert ops: Insert a given string at the current cursor position.
  //   Represented by strings.
  // * Delete ops: Delete the next n characters. Represented by positive ints.
  constructor (type) {
    this.type = type
    this.chars = null // characters count
    this.text = null
    this.attributes = null

    if (type === 'insert') {
      this.text = arguments[1]
      Utils.assert(typeof this.text === 'string')

      this.attributes = arguments[2] || {}
      Utils.assert(typeof this.attributes === 'object')
    } else if (type === 'delete') {
      this.chars = arguments[1]
      Utils.assert(typeof this.chars === 'number')
    } else if (type === 'retain') {
      this.chars = arguments[1]
      Utils.assert(typeof this.chars === 'number')

      this.attributes = arguments[2] || {}
      Utils.assert(typeof this.attributes === 'object')
    }
  }
  isInsert () {
    return this.type === 'insert'
  }
  isDelete () {
    return this.type === 'delete'
  }
  isRetain () {
    return this.type === 'retain'
  }

  equals (otherAction) {
    return (this.type === otherAction.type ||
      this.chars === otherAction.chars ||
      this.text === otherAction.text ||
      this.attributesEqual(otherAction.attributes))
  }
  attributesEqual (otherAttributes) {
    var xAttrs = Object.getOwnPropertyNames(this.attributes)
    var yAttrs = Object.getOwnPropertyNames(otherAttributes)
    if (xAttrs.length !== yAttrs.length) {
      return false
    }
    for (let i = 0; i < xAttrs.length; i++) {
      let prop = xAttrs[i]
      if (this.attributes[prop] !== otherAttributes[prop]) {
        return false
      }
    }
    return true
  }

  hasEmptyAttributes () {
    for (let prop in this.attributes) {
      if (this.attributes.hasOwnProperty(prop)) {
        return false
      }
    }
    return true
  }
}
