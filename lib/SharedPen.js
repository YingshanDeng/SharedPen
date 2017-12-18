'use strict'
import { AttributeConstants, SentinelConstants } from './Constants.js'
import EditorClient from './EditorClient.js'
import RichTextCodeMirror from './RichTextCodeMirror.js'
import RichTextCodeMirrorAdapter from './RichTextCodeMirrorAdapter.js'

class SharedPen {
  constructor (codeMirror) {
    // codemirror
    this._codeMirror = codeMirror
    // rich text codemirror
    this._richTextCodeMirror = new RichTextCodeMirror(this._codeMirror)
    // rich text codemirror adapter
    this.editorAdapter = new RichTextCodeMirrorAdapter(this._richTextCodeMirror)

    this.client = new EditorClient()
  }

  // style text methods
  bold () {
    this._richTextCodeMirror.toggleAttribute(AttributeConstants.BOLD)
    this._codeMirror.focus()
  }
  italic () {
    this._richTextCodeMirror.toggleAttribute(AttributeConstants.ITALIC)
    this._codeMirror.focus()
  }
  underline () {
    this._richTextCodeMirror.toggleAttribute(AttributeConstants.UNDERLINE)
    this._codeMirror.focus()
  }
  strike () {
    this._richTextCodeMirror.toggleAttribute(AttributeConstants.STRIKE)
    this._codeMirror.focus()
  }
  fontSize (size) {
    this._richTextCodeMirror.setAttribute(AttributeConstants.FONT_SIZE, size)
    this._codeMirror.focus()
  }
  font (font) {
    this._richTextCodeMirror.setAttribute(AttributeConstants.FONT, font)
    this._codeMirror.focus()
  }

  // undo/redo
  undo () {
    this.client.undo()
  }
  redo () {
    this.client.redo()
  }
}

export default SharedPen
