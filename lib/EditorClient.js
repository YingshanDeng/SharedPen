'use strict'
import Client from './Client.js'
import UndoManager from './UndoManager.js'

class SelfMeta {
  constructor (selectionBefore, selectionAfter) {
    this.selectionBefore = selectionBefore
    this.selectionAfter
  }
  invert () {
    return new SelfMeta(this.selectionAfter, this.selectionBefore)
  }
  compose (other) {
    return new SelfMeta(this.selectionBefore, other.selectionAfter)
  }
  transform (operation) {
    return new SelfMeta(
        this.selectionBefore.transform(operation),
        this.selectionAfter.transform(operation)
      )
  }
}

// TODO ...
class OtherClient {
  constructor (id, listEl, editorAdapter, name, selection) {
    this.id = id
    this.editorAdapter = editorAdapter

    this.name = name
    this.selection = selection
  }
  setColor (color) {
    this.color = color
  }
  setName (name) {
    if (this.name !== name) {
      this.name = name
    }
  }
  updateSelection (selection) {
    this.removeSelection()
    this.selection = selection
    this.mark = this.editorAdapter.setOtherSelection(
      selection,
      selection.position === selection.selectionEnd ? this.color : this.lightColor,
      this.id
    )
  }
  removeSelection () {
    if (this.mark) {
      this.mark.clear()
      this.mark = null
    }
  }
  remove () {
    this.removeSelection()
  }
}

class EditorClient extends Client {
  constructor (revision, serverAdapter, editorAdapter) {
    super(revision)

    this.serverAdapter = serverAdapter
    this.editorAdapter = editorAdapter
    this.undoManager = new UndoManager(50) // maximum history size
    this.clients = {}

    this.serverAdapter.registerCallbacks({

    })
    this.editorAdapter.registerCallbacks({
      focus: this.onFocus.bind(this),
      blur: this.onBlur.bind(this)
    })
    this.editorAdapter.registerUndo(this.undo.bind(this))
    this.editorAdapter.registerRedo(this.redo.bind(this))
  }

  onFocus () {
    // TODO
  }
  onBlur () {
    // TODO
  }

  undo () {
    if (!this.undoManager.canUndo()) { return }
    this.undoManager.performUndo((undoOp) => {
      this.applyUnredo(undoOp)
    })
  }
  redo () {
    if (!this.undoManager.canRedo()) { return }
    this.undoManager.performRedo((redoOp) => {
      this.applyUnredo(undoOp)
    })
  }
  applyUnredo (operation) {
    // TODO ...
  }
}

export default EditorClient
