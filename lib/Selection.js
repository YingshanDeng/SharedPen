'use strict'

// Range has `anchor` and `head` properties, which are zero-based indices into
// the document. The `anchor` is the side of the selection that stays fixed,
// `head` is the side of the selection where the cursor is. When both are
// equal, the range represents a cursor.
class Range {
  constructor (anchor, head) {
    this.anchor = anchor
    this.head = head
  }
  static fromJSON (obj) {
    return new Range(obj.anchor, obj.head)
  }
  equals (other) {
    return this.anchor === other.anchor && this.head === other.head
  }
  isEmpty () { // represents a cursor
    return this.anchor === this.head
  }
  transform (other) {
    function transformIndex (index) {
      var newIndex = index
      var ops = other.ops
      for (var i = 0, l = other.ops.length; i < l; i++) {
        if (ops[i].isRetain()) {
          index -= ops[i].chars
        } else if (ops[i].isInsert()) {
          newIndex += ops[i].text.length
        } else { // delete
          newIndex -= Math.min(index, ops[i].chars)
          index -= ops[i].chars
        }
        if (index < 0) { break }
      }
      return newIndex
    }

    var newAnchor = transformIndex(this.anchor)
    if (this.isEmpty()) {
      return new Range(newAnchor, newAnchor)
    } else {
      var newHead = transformIndex(this.head)
      return new Range(newAnchor, newHead)
    }
  }
}

// A selection is basically an array of ranges. Every range represents a real
// selection or a cursor in the document (when the start position equals the
// end position of the range). The array must not be empty.
class Selection {
  constructor (ranges) {
    this.ranges = ranges || []
  }

  // Convenience method for creating selections only containing a single cursor
  // and no real selection range.
  static createCursor (position) {
    return new Selection([new Range(position, position)])
  }
  static fromJSON (obj) {
    var objRanges = obj.ranges || obj
    return new Selection(objRanges.map(objRange => Range.fromJSON(objRange)))
  }

  equals (other) {
    if (this.ranges.length !== other.ranges.length) {
      return false
    }
    for (var i = 0; i < this.ranges.length; i++) {
      if (!this.ranges[i].equals(other.ranges[i])) {
        return false
      }
    }
    return true
  }
  somethingSelected () {
    return this.ranges.find((range) => !range.isEmpty())
  }
  compose (other) {
    return other
  }
  transform (other) {
    var newRanges = this.ranges.map(range => range.transform(other))
    return new Selection(newRanges)
  }
}

module.exports = {
  Range, Selection
}
