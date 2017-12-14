'use strict'
import Client from './Client.js'

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

class SharedPenClient extends Client {
  constructor () {
    // TODO...
    // super()
  }
}

export default SharedPenClient
