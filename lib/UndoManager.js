'use strict'
const WrappedOperation = require('./WrappedOperation.js')

const NORMAL_STATE = 'normal'
const UNDOING_STATE = 'undoing'
const REDOING_STATE = 'redoing'

module.exports =
class UndoManager {
  // Create a new UndoManager with an optional maximum history size.
  constructor (maxItems) {
    this.maxItems = maxItems || 50
    this.state = NORMAL_STATE

    this.dontCompose = false
    // array of WrappedOperation instances
    this.undoStack = []
    this.redoStack = []
  }
  // Add an operation to the undo or redo stack, depending on the current state
  // of the UndoManager. The operation added must be the inverse of the last
  // edit. When `compose` is true, compose the operation with the last operation
  // unless the last operation was alread pushed on the redo stack or was hidden
  // by a newer operation on the undo stack.
  add (operation, compose) {
    if (this.state === UNDOING_STATE) {
      this.redoStack.push(operation)
      this.dontCompose = true
    } else if (this.state === REDOING_STATE) {
      this.undoStack.push(operation)
      this.dontCompose = true
    } else {
      var undoStack = this.undoStack
      if (!this.dontCompose && compose && undoStack.length > 0) {
        undoStack.push(operation.compose(undoStack.pop()))
      } else {
        undoStack.push(operation)
        if (undoStack.length > this.maxItems) {
          undoStack.shift()
        }
      }
      this.dontCompose = false
      this.redoStack = []
    }
  }
  transform (operation) {
    this.undoStack = this._transformStack(this.undoStack, operation)
    this.redoStack = this._transformStack(this.redoStack, operation)
  }
  _transformStack (stack, operation) {
    var newStack = []
    for (var i = stack.length - 1; i >= 0; i--) {
      var pair = WrappedOperation.transform(stack[i], operation)
      if (typeof pair[0].isNoop !== 'function' || !pair[0].isNoop()) {
        newStack.push(pair[0])
      }
      operation = pair[1]
    }
    return newStack.reverse()
  }

  // Perform an undo by calling a function with the latest operation on the undo
  // stack. The function is expected to call the `add` method with the inverse
  // of the operation, which pushes the inverse on the redo stack.
  performUndo (fn) {
    this.state = UNDOING_STATE
    if (!this.canUndo()) {
      throw new Error('can not undo, undo stack is empty')
    }
    fn(this.undoStack.pop())
    this.state = NORMAL_STATE
  }
  // The inverse of `performUndo`.
  performRedo (fn) {
    this.state = REDOING_STATE
    if (!this.canRedo()) {
      throw new Error('can not redo, redo stack is empty')
    }
    fn(this.redoStack.pop())
    this.state = NORMAL_STATE
  }

  // Is the undo/redo stack not empty?
  canUndo () {
    return !!this.undoStack.length
  }
  canRedo () {
    return !!this.redoStack.length
  }
  // Whether the UndoManager is currently performing an undo/redo
  isUndoing () {
    return this.state === UNDOING_STATE
  }
  isRedoing () {
    return this.state === REDOING_STATE
  }
}
