'use strict'

class SharedPen {
  constructor (codeMirror) {
    // codemirror
    this.cm = codeMirror
    // rich text codemirror
    this.rtcm = new RichTextCodeMirror(this.cm)
    // rich text codemirror adapter
    this.rtcmAdapter = new RichTextCodeMirrorAdapter(this.rtcm)

    // this.client = new EditorClient()
  }

  // style text methods
  bold () {
    this.rtcm.toggleAttribute(AttributeConstants.BOLD)
    this.cm.focus()
  }
  italic () {
    this.rtcm.toggleAttribute(AttributeConstants.ITALIC)
    this.cm.focus()
  }
  underline () {
    this.rtcm.toggleAttribute(AttributeConstants.UNDERLINE)
    this.cm.focus()
  }
  strike () {
    this.rtcm.toggleAttribute(AttributeConstants.STRIKE)
    this.cm.focus()
  }
  fontSize (size) {
    this.rtcm.setAttribute(AttributeConstants.FONT_SIZE, size)
    this.cm.focus()
  }
  font (font) {
    this.rtcm.setAttribute(AttributeConstants.FONT, font)
    this.cm.focus()
  }

  // undo/redo
  undo () {
    this.client.undo()
  }
  redo () {
    this.client.redo()
  }
}
