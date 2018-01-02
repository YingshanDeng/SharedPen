'use strict'
const Utils = require('./Utils.js')
const { Client, AwaitingWithBuffer } = require('./Client.js')
const UndoManager = require('./UndoManager.js')
const TextOperation = require('./TextOperation.js')
const { Range, Selection } = require('./Selection.js')
const WrappedOperation = require('./WrappedOperation.js')

class SelfMeta {
  constructor (selectionBefore, selectionAfter) {
    this.selectionBefore = selectionBefore
    this.selectionAfter = selectionAfter
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

class OtherClient {
  constructor (editorAdapter, id, name, selection) {
    this.editorAdapter = editorAdapter
    this.id = id
    this.name = name || id
    this.setColor(name ? Utils.hueFromName(name) : Math.random())

    this.selection = selection || new Selection([new Range(0, 0)])
    this.updateSelection(this.selection)
  }
  setColor (hue) {
    this.hue = hue
    this.color = Utils.hsl2hex(hue, 0.75, 0.5) // cursor color
    this.lightColor = Utils.hsl2hex(hue, 0.5, 0.9) // selection color
  }
  setName (name) {
    if (this.name !== name) {
      this.name = name
    }

    this.setColor(Utils.hueFromName(name))
  }
  updateSelection (selection) {
    this.removeSelection()
    this.selection = selection
    this.mark = this.editorAdapter.setOtherSelection(
      selection,
      // cursor color: this.color
      // selection color: this.lightColor
      selection.somethingSelected() ? this.lightColor : this.color,
      this.id
    )
  }
  removeSelection () {
    if (this.mark) {
      this.mark.clear()
      this.mark = null
    }
  }
  // disconnect
  remove () {
    this.removeSelection()
  }
}

module.exports =
class EditorClient extends Client {
  constructor (data, serverAdapter, editorAdapter) {
    // data: {document, revision, clients, operations}
    // [info]:document: plain text, after operations replay, it become rich text
    super(data.revision, data.operations)
    Utils.makeEventEmitter(EditorClient, ['undoStatesChanged', 'clientsChanged'], this)

    this.serverAdapter = serverAdapter
    this.editorAdapter = editorAdapter
    this.undoManager = new UndoManager(50) // maximum history size
    this.clients = {}

    // init the exist clients
    let allKeys = Object.keys(data.clients)
    if (allKeys.length) {
      for (var i = 0; i < allKeys.length ; i++) {
        let clientId = allKeys[i]
        let client = data.clients[clientId]
        this.clients[clientId] = new OtherClient(this.editorAdapter, client.id, client.name, Selection.fromJSON(client.selection))
      }
      // TODO ... 初始化的 clients 是否通过 ready 传递会更合适
      setTimeout(() => {
        this.trigger('clientsChanged', this._parseClientsInfo())
      })
    }

    this.serverAdapter.registerCallbacks({
      client_join: (clientObj) => {
        this.onClientJoin(clientObj)
      },
      client_left: (clientId) => {
        this.onClientLeft(clientId)
      },
      set_name: (clientId, name) => {
        this.getClientObject(clientId).setName(name)
      },
      ack: () => {
        this.serverAck()
      },
      operation: (operation) => {
        this.applyServer(TextOperation.fromJSON(operation))
      },
      selection: (clientId, selection) => {
        if (selection) {
          this.getClientObject(clientId).updateSelection(
            this.transformSelection(Selection.fromJSON(selection))
          )
        } else {
          this.getClientObject(clientId).removeSelection()
        }
      },
      clients: (clients) => {
        var clientId
        for (clientId in this.clients) {
          if (this.clients.hasOwnProperty(clientId) &&
            !clients.hasOwnProperty(clientId)) {
            this.onClientLeft(clientId)
          }
        }

        for (clientId in clients) {
          if (clients.hasOwnProperty(clientId)) {
            var clientObject = this.getClientObject(clientId)

            if (clients[clientId].name) {
              clientObject.setName(clients[clientId].name)
            }

            var selection = clients[clientId].selection
            if (selection) {
              this.clients[clientId].updateSelection(
                this.transformSelection(Selection.fromJSON(selection))
              )
            } else {
              this.clients[clientId].removeSelection()
            }
          }
        }
      },
      reconnect: () => {
        this.serverReconnect()
      }
    })

    this.editorAdapter.registerCallbacks({
      change: this.onChange.bind(this),
      selectionChange: this.onSelectionChange.bind(this),
      focus: this.onFocus.bind(this),
      blur: this.onBlur.bind(this)
    })
    this.editorAdapter.registerUndo(this.undo.bind(this))
    this.editorAdapter.registerRedo(this.redo.bind(this))

    this.initClientContent()
    this._simultaneousFlag = false
  }

  sendOperation (revision, operation) {
    this.serverAdapter.sendOperation(revision, operation.toJSON(), this.selection)
  };

  applyOperation (operation) {
    this.editorAdapter.applyOperation(operation)
    this.updateSelection()
    this.undoManager.transform(new WrappedOperation(operation, null))
  }

  /** ************************* server adapter callbacks ***************************/
  onClientJoin (clientObj) {
    let clientId = clientObj.id
    console.log('User join: ', clientId)
    this.clients[clientId] = new OtherClient(this.editorAdapter, clientId, clientObj.name, Selection.fromJSON(clientObj.selection))
    this.trigger('clientsChanged', this._parseClientsInfo())
  }
  onClientLeft (clientId) {
    console.log('User left: ' + clientId)
    var client = this.clients[clientId]
    if (!client) { return }
    client.remove()
    delete this.clients[clientId]

    this.trigger('clientsChanged', this._parseClientsInfo())
  }
  _parseClientsInfo () {
    return Object.values(this.clients).map(client => ({
      id: client.id,
      name: client.name,
      color: client.color,
      lightColor: client.lightColor
    }))
  }
  getClientObject (clientId) {
    var client = this.clients[clientId]
    if (client) {
      return client
    }
    this.clients[clientId] = new OtherClient(this.editorAdapter, clientId)
    return this.clients[clientId]
  }

  /** ************************* editor adapter callbacks ***************************/
  onChange (textOperation, inverse) {
    console.log('--onChange--: ', textOperation)

    var selectionBefore = this.selection
    this.updateSelection()

    var last = arr => arr[arr.length - 1]
    var compose = this.undoManager.undoStack.length > 0 &&
      inverse.shouldBeComposedWithInverted(last(this.undoManager.undoStack).wrapped)
    var inverseMeta = new SelfMeta(this.selection, selectionBefore)

    // if multi-ranges' attributes changed simultaneously,
    // we need to compose them together when push to undo stack, so we can undo them one click
    this.undoManager.add(new WrappedOperation(inverse, inverseMeta), compose || this._simultaneousFlag)

    var length = this.editorAdapter.rtcm.codeMirror.doc.listSelections().length
    if (textOperation.baseLength === textOperation.targetLength && length >= 2) {
      this._simultaneousFlag = true
    } else {
      this._simultaneousFlag = false
    }
    // SuperClass Client method: send the operation to server
    this.applyClient(textOperation)

    this.trigger('undoStatesChanged', {
      canUndo: this.undoManager.canUndo(),
      canRedo: this.undoManager.canRedo()
    })
  }
  updateSelection () {
    this.selection = this.editorAdapter.getSelection()
  }

  onSelectionChange () {
    var oldSelection = this.selection
    this.updateSelection()
    if (oldSelection && this.selection.equals(oldSelection)) { return }
    this.sendSelection(this.selection)
  }
  sendSelection (selection) {
    if (this.state instanceof AwaitingWithBuffer) { return }
    this.serverAdapter.sendSelection(selection)
  }

  onFocus () {
    this.onSelectionChange()
  }
  onBlur () {
    this.selection = null
    this.sendSelection(null)
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
      this.applyUnredo(redoOp)
    })
  }
  applyUnredo (operation) {
    this.undoManager.add(this.editorAdapter.invertOperation(operation))
    this.editorAdapter.applyOperation(operation.wrapped)
    this.selection = operation.meta.selectionAfter
    if (this.selection) {
      this.editorAdapter.setSelection(this.selection)
    }
    // send the operation to server
    this.applyClient(operation.wrapped)

    this.trigger('undoStatesChanged', {
      canUndo: this.undoManager.canUndo(),
      canRedo: this.undoManager.canRedo()
    })
  }
}
