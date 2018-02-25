'use strict'
const Utils = require('./Utils.js')
const { AttributeConstants } = require('./Constants.js')
const RichTextCodeMirror = require('./RichTextCodeMirror.js')
const RichTextCodeMirrorAdapter = require('./RichTextCodeMirrorAdapter.js')
const ClientSocketIOAdapter = require('./ClientSocketIOAdapter.js')
const EditorClient = require('./EditorClient.js')

module.exports =
class SharedPen {
  constructor (cm, url) {
    if (!window.CodeMirror) {
      throw new Error('Couldn\'t find CodeMirror. Did you forget to include codemirror.js?')
    }
    if (!window.io) {
      throw new Error('Couldn\'t find SocketIO. Did you forget to include socket.io.js?')
    }

    // initialize CodeMirror
    var textarea = cm
    if (typeof cm === 'string') {
      textarea = document.querySelector(cm)
    }
    this.cm = window.CodeMirror.fromTextArea(textarea, {
      lineNumbers: false,
      lineWrapping: true,
      cursorHeight: 0.88
    })
    var _cmWrapper = this.cm.getWrapperElement() // . CodeMirror-wrap
    _cmWrapper.parentNode.addEventListener('click', () => {
      this.cm.focus()
    })

    this._sharedpenWrapper = Utils.elt('div', null, { class: 'sharedpen-wrapper' })
    _cmWrapper.parentNode.replaceChild(this._sharedpenWrapper, _cmWrapper)
    this._sharedpenWrapper.appendChild(_cmWrapper)

    Utils.makeEventEmitter(SharedPen, ['ready', 'realtimeTextAttrsChanged', 'undoStatesChanged', 'clientsChanged'], this)

    // rich text codemirror
    this.rtcm = new RichTextCodeMirror(this.cm)
    // rich text codemirror adapter
    this.rtcmAdapter = new RichTextCodeMirrorAdapter(this.rtcm)

    // TODO ... 创建 socket 应该放到 ClientSocketIOAdapter 是否更合适 ???
    var socket = window.io(url)
    socket.on('doc', (data) => {
      this.socketIOAdapter = new ClientSocketIOAdapter(socket)
      this.client = new EditorClient(data, this.socketIOAdapter, this.rtcmAdapter)
      // 监听实时文本属性变化
      this.rtcm.on('realtimeTextAttrsChanged', this.trigger.bind(this, 'realtimeTextAttrsChanged'))
      // 监听实时 canUndo/canRedo 变化
      this.client.on('undoStatesChanged', this.trigger.bind(this, 'undoStatesChanged'))
      // 监听协同用户变化
      this.client.on('clientsChanged', this.trigger.bind(this, 'clientsChanged'))
      this.trigger('ready')
    })

    if (!window.CodeMirror.keyMap['sharedpen']) {
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
    // TODO
    window.CodeMirror.keyMap['sharedpen'] = {
      // basic
      'Ctrl-B': binder(this.bold.bind(this)),
      'Cmd-B': binder(this.bold.bind(this)),
      'Ctrl-I': binder(this.italic.bind(this)),
      'Cmd-I': binder(this.italic.bind(this)),
      'Ctrl-U': binder(this.underline.bind(this)),
      'Cmd-U': binder(this.underline.bind(this)),
      'Shift-Cmd-X': binder(this.strike.bind(this)),
      'Shift-Ctrl-X': binder(this.strike.bind(this)),
      // align
      'Shift-Cmd-L': binder(this.align.bind(this, 'left')),
      'Shift-Ctrl-L': binder(this.align.bind(this, 'left')),
      'Shift-Cmd-E': binder(this.align.bind(this, 'center')),
      'Shift-Ctrl-E': binder(this.align.bind(this, 'center')),
      'Shift-Cmd-R': binder(this.align.bind(this, 'right')),
      'Shift-Ctrl-R': binder(this.align.bind(this, 'right')),
      'Shift-Cmd-J': binder(this.align.bind(this, 'justify')),
      'Shift-Ctrl-J': binder(this.align.bind(this, 'justify')),
      // list
      'Shift-Cmd-7': binder(this.orderedList.bind(this)),
      'Shift-Ctrl-7': binder(this.orderedList.bind(this)),
      'Shift-Cmd-8': binder(this.unorderedList.bind(this)),
      'Shift-Ctrl-8': binder(this.unorderedList.bind(this)),
      'Shift-Cmd-9': binder(this.todoList.bind(this)),
      'Shift-Ctrl-9': binder(this.todoList.bind(this)),
      // indent/unindent
      'Cmd-]': binder(this.indent.bind(this)),
      'Ctrl-]': binder(this.indent.bind(this)),
      'Cmd-[': binder(this.unindent.bind(this)),
      'Ctrl-[': binder(this.unindent.bind(this)),
      // insert link
      'Cmd-K': binder(this.insertLink.bind(this)),
      'Ctrl-K': binder(this.insertLink.bind(this)),
      // clear format
      'Cmd-\\': binder(this.clearFormat.bind(this)),
      'Ctrl-\\': binder(this.clearFormat.bind(this)),

      'Enter': binder(this.newline.bind(this)),
      'Delete': binder(this.deleteRight.bind(this)),
      'Backspace': binder(this.deleteLeft.bind(this)),
      'Tab': binder(this.indent.bind(this)),
      'Shift-Tab': binder(this.unindent.bind(this)),
      fallthrough: ['default']
    }
  }
  // undo/redo
  undo () {
    this.client.undo()
  }
  redo () {
    this.client.redo()
  }
  // 格式刷
  format () {
    this.rtcm.format()
    this.cm.focus()
  }
  // 清除格式
  clearFormat () {
    this.rtcm.clearFormat()
    this.cm.focus()
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
  highlight (color) { // set background
    this.rtcm.toggleAttribute(AttributeConstants.BACKGROUND_COLOR, color)
    this.cm.focus()
  }
  align (alignment) {
    if (alignment !== 'left' && alignment !== 'center' && alignment !== 'right' && alignment !== 'justify') {
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
  todoList () {
    this.rtcm.toggleTodo()
    this.cm.focus()
  }

  insertLink () {

  }
  insertImage () {

  }

  insertEntity (type, info, origin) {
    this.rtcm.insertEntityAtCursor(type, info, origin)
  }
  insertEntityAt (index, type, info, origin) {
    this.rtcm.insertEntityAt(index, type, info, origin)
  }
}
