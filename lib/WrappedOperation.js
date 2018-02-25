'use strict'

// Copy all properties from source to target.
function copy (source, target) {
  for (var key in source) {
    if (source.hasOwnProperty(key)) {
      target[key] = source[key]
    }
  }
}

function composeMeta (a, b) {
  if (a && typeof a === 'object') {
    if (typeof a.compose === 'function') { return a.compose(b) }
    var meta = {}
    copy(a, meta)
    copy(b, meta)
    return meta
  }
  return b
}

function transformMeta (meta, operation) {
  if (meta && typeof meta === 'object' && typeof meta.transform === 'function') {
    return meta.transform(operation)
  }
  return meta
}

module.exports =
class WrappedOperation {
  // A WrappedOperation contains an operation and corresponing metadata.
  constructor (operation, metadata) {
    this.wrapped = operation
    this.meta = metadata
  }
  apply () {
    return this.wrapped.apply.apply(this.wrapped, arguments)
  }
  invert () {
    var meta = this.meta
    if (meta && typeof meta === 'object' && typeof meta.invert === 'function') {
      meta = this.meta.invert.apply(meta, arguments)
    }
    return new WrappedOperation(
      this.wrapped.invert.apply(this.wrapped, arguments),
      meta
    )
  }
  compose (other) {
    return new WrappedOperation(
      this.wrapped.compose(other.wrapped),
      composeMeta(this.meta, other.meta)
    )
  }
  transform (other) {
    return WrappedOperation.transform(this, other)
  }

  static transform (a, b) {
    var pair = a.wrapped.transform(b.wrapped)
    return [
      new WrappedOperation(pair[0], transformMeta(a.meta, b.wrapped)),
      new WrappedOperation(pair[1], transformMeta(b.meta, a.wrapped))
    ]
  }
}
