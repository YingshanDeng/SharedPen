'use strict'

class Utils {
  static assert (b, msg) {
    if (!b) {
      throw new Error(msg || 'assertion error')
    }
  }
}

export default Utils
