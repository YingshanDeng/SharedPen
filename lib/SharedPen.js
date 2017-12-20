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

    if (!CodeMirror.keyMap['sharedpen']) {
      this.initializeKeyMap_()
    }
    this.cm.setOption('keyMap', 'sharedpen')
  }

  initializeKeyMap_ () {
    function binder (fn) {
      return function (cm) {
        // HACK: CodeMirror will often call our key handlers within a cm.operation(), and that
        // can mess us up (we rely on events being triggered synchronously when we make CodeMirror
        // edits).  So to escape any cm.operation(), we do a setTimeout.
        setTimeout(fn, 0)
      }
    }
    CodeMirror.keyMap['sharedpen'] = {
      'Ctrl-B': binder(this.bold.bind(this)),
      'Cmd-B': binder(this.bold.bind(this)),
      'Ctrl-I': binder(this.italic.bind(this)),
      'Cmd-I': binder(this.italic.bind(this)),
      'Ctrl-U': binder(this.underline.bind(this)),
      'Cmd-U': binder(this.underline.bind(this)),
      'Ctrl-H': binder(this.highlight.bind(this)),
      'Cmd-H': binder(this.highlight.bind(this)),
      'Enter': binder(this.newline.bind(this)),
      'Delete': binder(this.deleteRight.bind(this)),
      'Backspace': binder(this.deleteLeft.bind(this)),
      'Tab': binder(this.indent.bind(this)),
      'Shift-Tab': binder(this.unindent.bind(this)),
      fallthrough: ['default']
    }
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
  color (color) {
    this.rtcm.setAttribute(AttributeConstants.COLOR, color)
    this.cm.focus()
  }
  highlight () { // set background
    this.rtcm.toggleAttribute(AttributeConstants.BACKGROUND_COLOR, 'rgba(255,255,0,.65)')
    this.cm.focus()
  }
  align (alignment) {
    if (alignment !== 'left' && alignment !== 'center' && alignment !== 'right') {
      throw new Error('align() must be passed "left", "center", or "right".')
    }
    this.rtcm.setLineAttribute(AttributeConstants.LINE_ALIGN, alignment)
    this.cm.focus()
  }
  newline () {
    this.rtcm.newline()
  }
  deleteLeft () {
    this.rtcm.deleteLeft()
  }
  deleteRight () {
    this.rtcm.deleteRight()
  }
  indent () {
    this.rtcm.indent()
    this.cm.focus()
  }
  unindent () {
    this.rtcm.unindent()
    this.cm.focus()
  }
  // list
  orderedList () {
    this.rtcm.toggleLineAttribute(AttributeConstants.LIST_TYPE, 'o')
    this.cm.focus()
  }
  unorderedList () {
    this.rtcm.toggleLineAttribute(AttributeConstants.LIST_TYPE, 'u')
    this.cm.focus()
  };
  todoList() {
    this.rtcm.toggleTodo();
    this.cm.focus();
  }
  // undo/redo
  undo () {
    // TODO ...
    this.client.undo()
  }
  redo () {
    this.client.redo()
  }
}
