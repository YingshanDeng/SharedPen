'use strict'
import Utils from './Utils.js'
import { AttributeConstants, SentinelConstants } from './Constants.js'
import AnnotationList from './AnnotationList.js'

class RichTextAnnotation {
  /**
   * Used for the annotations we store in our AnnotationList.
   * @param attributes
   * @constructor
   */
  constructor (attributes) {
    this.attributes = attributes || {}
  }
  equals (other) {
    if (!(other instanceof RichTextAnnotation)) {
      return false
    }
    var aAttrs = Object.getOwnPropertyNames(this)
    var bAttrs = Object.getOwnPropertyNames(other)

    if (aAttrs.length != bAttrs.length) {
      return false
    }

    for (let attr in aAttrs) {
      if (this.attributes[attr] !== other.attributes[attr]) {
        return false
      }
    }
    return true
  }
}

const LineSentinelCharacter = SentinelConstants.LineSentinelCharacter
const ENTITY_SENTINEL_CHARACTER = SentinelConstants.ENTITY_SENTINEL_CHARACTER
const RTCMClassNamePrefix = 'sharedpen-'

// These attributes will have styles generated dynamically in the page.
const DynamicStyleAttributes = {
  'c': 'color',
  'bc': 'background-color',
  'fs': 'font-size',
  'li': function (indent) { return 'padding-left: ' + (indent * 40) + 'px' }
}
// A cache of dynamically-created styles so we can re-use them.
const StyleCache_ = {}

class RichTextCodeMirror {
  constructor (codeMirror) {
    this.codeMirror = codeMirror
    this.currentAttributes_ = null

    this.annotationList_ = new AnnotationList((oldNodes, newNodes) => {
      self.onAnnotationsChanged_(oldNodes, newNodes)
    })
    // Ensure annotationList is in sync with any existing codemirror contents.
    this.initAnnotationList_()

    this.codeMirror.on('changes', this.onCodeMirrorChange_)
    this.codeMirror.on('beforeChange', this.onCodeMirrorBeforeChange_)
    this.codeMirror.on('cursorActivity', this.onCursorActivity_)

    // register events
    Utils.makeEventEmitter(RichTextCodeMirror, ['change', 'attributesChange', 'newLine'])
  }
  detach () {
    this.codeMirror.off('beforeChange', this.onCodeMirrorBeforeChange_)
    this.codeMirror.off('changes', this.onCodeMirrorChange_)
    this.codeMirror.off('cursorActivity', this.onCursorActivity_)
    this.clearAnnotations_()
  }
  end () {
    var lastLine = this.codeMirror.lineCount() - 1
    var lastLineLength = this.codeMirror.getLine(lastLine).length
    return this.codeMirror.indexFromPos({
      line: lastLine,
      ch: lastLineLength
    })
  }
  getRange (start, end) {
    var from = this.codemirror.posFromIndex(start)
    var to = this.codemirror.posFromIndex(end)
    return this.codemirror.getRange(from, to)
  }

  setAttribute (attribute, value) {
    var cm = this.codeMirror
    if (this.emptySelection_()) {
      var attrs = this.getCurrentAttributes_()
      if (value === false) {
        delete attrs[attribute]
      } else {
        attrs[attribute] = value
      }
      this.currentAttributes_ = attrs
    } else {
      this.updateTextAttributes(
        cm.indexFromPos(cm.getCursor('start')),
        cm.indexFromPos(cm.getCursor('end')),
        function (attributes) {
          if (value === false) {
            delete attributes[attribute]
          } else {
            attributes[attribute] = value
          }
        }
      )

      this.updateCurrentAttributes_()
    }
  }
  toggleAttribute (attribute, value) {
    var trueValue = value || true
    if (this.emptySelection_()) {
      var attrs = this.getCurrentAttributes_()
      if (attrs[attribute] === trueValue) {
        delete attrs[attribute]
      } else {
        attrs[attribute] = trueValue
      }
      this.currentAttributes_ = attrs
    } else {
      var attributes = this.getCurrentAttributes_()
      var newValue = (attributes[attribute] !== trueValue) ? trueValue : false
      this.setAttribute(attribute, newValue)
    }
  }
  updateTextAttributes (start, end, updateFn, origin, doLineAttributes) {
    var newChanges = []
    var pos = start
    var self = this
    this.annotationList_.updateSpan(new Span(start, end - start), function (annotation, length) {
      var attributes = { }
      for (var attr in annotation.attributes) {
        attributes[attr] = annotation.attributes[attr]
      }

      // Don't modify if this is a line sentinel.
      if (!attributes[AttributeConstants.LINE_SENTINEL] || doLineAttributes) { updateFn(attributes) }

      // changedAttributes will be the attributes we changed, with their new values.
      // changedAttributesInverse will be the attributes we changed, with their old values.
      var changedAttributes = {}
      var changedAttributesInverse = {}
      self.computeChangedAttributes_(
        annotation.attributes,
        attributes,
        changedAttributes,
        changedAttributesInverse
      )
      if (!emptyAttributes(changedAttributes)) {
        newChanges.push({
          start: pos,
          end: pos + length,
          attributes: changedAttributes,
          attributesInverse: changedAttributesInverse,
          origin: origin
        })
      }

      pos += length
      return new RichTextAnnotation(attributes)
    })

    if (newChanges.length > 0) {
      this.trigger('attributesChange', this, newChanges)
    }
  }
  replaceText (start, end, text, attributes, origin) {

  }
  insertText (index, text, attributes, origin) {

  }
  removeText (start, end, origin) {

  }
  tryToUpdateEntitiesInPlace (oldNodes, newNodes) {
    // TODO...
    // Loop over nodes in reverse order so we can easily splice them out as necessary.
    // var oldNodesLen = oldNodes.length;
    // while (oldNodesLen--) {
    //   var oldNode = oldNodes[oldNodesLen];
    //   var newNodesLen = newNodes.length;
    //   while (newNodesLen--) {
    //     var newNode = newNodes[newNodesLen];
    //     if (oldNode.pos == newNode.pos &&
    //         oldNode.length == newNode.length &&
    //         oldNode.annotation.attributes['ent'] &&
    //         oldNode.annotation.attributes['ent'] == newNode.annotation.attributes['ent']) {
    //       var entityType = newNode.annotation.attributes['ent'];
    //       if (this.entityManager_.entitySupportsUpdate(entityType)) {
    //         // Update it in place and remove the change from oldNodes / newNodes so we don't process it below.
    //         oldNodes.splice(oldNodesLen, 1);
    //         newNodes.splice(newNodesLen, 1);
    //         var marker = oldNode.getAttachedObject();
    //         marker.update(newNode.annotation.attributes);
    //         newNode.attachObject(marker);
    //       }
    //     }
    //   }
    // }
  }

  initAnnotationList_ () {
    // Insert empty annotation span for existing content.
    var end = this.end()
    if (end !== 0) {
      this.annotationList_.insertAnnotatedSpan(new Span(0, end), new RichTextAnnotation())
    }
  }
  clearAnnotations_ () {
    this.annotationList_.updateSpan(new Span(0, this.end()), function (annotation, length) {
      return new RichTextAnnotation({})
    })
  }

  // from codemirror changes
  onCodeMirrorChange_ (cm, cmChanges) {
    // Handle single change objects and linked lists of change objects.
    if (typeof cmChanges.from === 'object') {
      var changeArray = []
      while (cmChanges) {
        changeArray.push(cmChanges)
        cmChanges = cmChanges.next
      }
      cmChanges = changeArray
    }

    // convert positions to indexes
    var changes = this.convertCoordinateSystemForChanges_(cmChanges)
    var newChanges = []

    for (var i = 0; i < changes.length; i++) {
      var change = changes[i]
      var start = change.start
      var end = change.end
      var text = change.text
      var removed = change.removed
      var origin = change.origin

      // When text with multiple sets of attributes on it is removed,
      // we need to split it into separate remove changes.
      if (removed.length > 0) {
        var oldAnnotationSpans = this.annotationList_.getAnnotatedSpansForSpan(new Span(start, removed.length))
        var removedPos = 0
        for (var j = 0; j < oldAnnotationSpans.length; j++) {
          var span = oldAnnotationSpans[j]
          newChanges.push({
            start: start,
            end: start + span.length,
            removedAttributes: span.annotation.attributes,
            removed: removed.substr(removedPos, span.length),
            attributes: {},
            text: '',
            origin: change.origin
          })
          removedPos += span.length
        }

        this.annotationList_.removeSpan(new Span(start, removed.length))
      }

      if (text.length > 0) {
        var attributes
        // TODO: Handle 'paste' differently?
        if (change.origin === '+input' || change.origin === 'paste') {
          attributes = this.currentAttributes_ || {}
        } else if (origin in this.outstandingChanges_) {
          attributes = this.outstandingChanges_[origin].attributes
          origin = this.outstandingChanges_[origin].origOrigin
          delete this.outstandingChanges_[origin]
        } else {
          attributes = {}
        }

        this.annotationList_.insertAnnotatedSpan(
          new Span(start, text.length),
          new RichTextAnnotation(attributes)
        )

        newChanges.push({
          start: start,
          end: start,
          removedAttributes: {},
          removed: '',
          text: text,
          attributes: attributes,
          origin: origin
        })
      }
    }

    this.markLineSentinelCharactersForChanges_(cmChanges)

    if (newChanges.length > 0) {
      this.trigger('change', this, newChanges)
    }
  }
  onCodeMirrorBeforeChange_ () {

  }
  onCursorActivity_ () {
    setTimeout(this.updateCurrentAttributes_.bind(this), 1)
  }

  /**
   * Updates the nodes of an Annotation.
   * @param {Array.<OldAnnotatedSpan>} oldNodes The list of nodes to replace.
   * @param {Array.<NewAnnotatedSpan>} newNodes The new list of nodes.
   */
  onAnnotationsChanged_ (oldNodes, newNodes) {
    var marker
    var linesToReMark = {}

    // Update any entities in-place that we can.  This will remove them from the oldNodes/newNodes lists
    // so we don't remove and recreate them below.
    // TODO ...
    this.tryToUpdateEntitiesInPlace(oldNodes, newNodes)

    for (var i = 0; i < oldNodes.length; i++) {
      var attributes = oldNodes[i].annotation.attributes
      if (AttributeConstants.LINE_SENTINEL in attributes) {
        linesToReMark[this.codeMirror.posFromIndex(oldNodes[i].pos).line] = true
      }
      marker = oldNodes[i].getAttachedObject()
      if (marker) {
        marker.clear()
      }
    }

    for (i = 0; i < newNodes.length; i++) {
      var annotation = newNodes[i].annotation
      var forLine = (AttributeConstants.LINE_SENTINEL in annotation.attributes)
      var entity = (AttributeConstants.ENTITY_SENTINEL in annotation.attributes)

      var from = this.codeMirror.posFromIndex(newNodes[i].pos)
      if (forLine) {
        linesToReMark[from.line] = true
      } else if (entity) {
        // TODO ...
        this.markEntity_(newNodes[i])
      } else {
        var className = this.getClassNameForAttributes_(annotation.attributes)
        if (className !== '') {
          var to = this.codeMirror.posFromIndex(newNodes[i].pos + newNodes[i].length)
          marker = this.codeMirror.markText(from, to, { className: className })
          newNodes[i].attachObject(marker)
        }
      }
    }

    for (var line in linesToReMark) {
      this.dirtyLines_.push(this.codeMirror.getLineHandle(Number(line)))
      this.queueLineMarking_()
    }
  }

  getClassNameForAttributes_ (attributes) {
    var globalClassName = ''
    for (var attr in attributes) {
      var val = attributes[attr]
      if (attr === AttributeConstants.LINE_SENTINEL) {
        Utils.assert(val === true, 'LINE_SENTINEL attribute should be true if it exists.')
      } else {
        var className = RTCMClassNamePrefix + attr

        if (val !== true) {
          // Append "px" to font size if it's missing.
          if (attr === AttributeConstants.FONT_SIZE && typeof val !== 'string') {
            val = val + 'px'
          }
          // TODO ... 这个好像没啥用
          var classVal = val.toString().toLowerCase().replace(/[^a-z0-9-_]/g, '-')
          className += '-' + classVal
          if (DynamicStyleAttributes[attr]) {
            if (!StyleCache_[attr]) StyleCache_[attr] = {}
            if (!StyleCache_[attr][classVal]) {
              StyleCache_[attr][classVal] = true
              var dynStyle = DynamicStyleAttributes[attr]
              var css = (typeof dynStyle === 'function') ? dynStyle(val) : `${dynStyle}: ${val}`
              var selector = (attr == AttributeConstants.LINE_INDENT) ? `pre.${className}` : `.${className}`
              Utils.addStyleWithCSS(`${selector} { ${css} }`)
            }
          }
        }
        globalClassName = globalClassName + ' ' + className
      }
    }
    return globalClassName
  }

  // get current selection or cursor attributes
  getCurrentAttributes_ () {
    if (!this.currentAttributes_) {
      this.updateCurrentAttributes_()
    }
    return this.currentAttributes_
  }
  updateCurrentAttributes_ () {
    var cm = this.codeMirror
    var anchor = cm.indexFromPos(cm.getCursor('anchor'))
    var head = cm.indexFromPos(cm.getCursor('head'))
    var pos = head
    if (anchor > head) { // backwards selection
      // Advance past any newlines or line sentinels.
      while (pos < this.end()) {
        var c = this.getRange(pos, pos + 1)
        if (c !== '\n' && c !== LineSentinelCharacter) { break }
        pos++
      }
      if (pos < this.end()) { pos++ } // since we're going to look at the annotation span to the left to decide what attributes to use.
    } else {
      // Back up before any newlines or line sentinels.
      while (pos > 0) {
        c = this.getRange(pos - 1, pos)
        if (c !== '\n' && c !== LineSentinelCharacter) { break }
        pos--
      }
    }
    var spans = this.annotationList_.getAnnotatedSpansForPos(pos)
    this.currentAttributes_ = {}

    var attributes = {}
    // Use the attributes to the left unless they're line attributes (in which case use the ones to the right.
    if (spans.length > 0 && (!(AttributeConstants.LINE_SENTINEL in spans[0].annotation.attributes))) {
      attributes = spans[0].annotation.attributes
    } else if (spans.length > 1) {
      Utils.assert(!(AttributeConstants.LINE_SENTINEL in spans[1].annotation.attributes), "Cursor can't be between two line sentinel characters.")
      attributes = spans[1].annotation.attributes
    }
    for (var attr in attributes) {
      // Don't copy line or entity attributes.
      if (attr !== 'l' && attr !== 'lt' && attr !== 'li' && attr.indexOf(AttributeConstants.ENTITY_SENTINEL) !== 0) {
        this.currentAttributes_[attr] = attributes[attr]
      }
    }
  }

  // We have to convert the positions in the pre-change coordinate system to indexes.
  // CodeMirror's `indexFromPos` method does this for the current state of the editor.
  // We can use the information of a single change object to convert a post-change
  // coordinate system to a pre-change coordinate system. We can now proceed inductively
  // to get a pre-change coordinate system for all changes in the linked list.  A
  // disadvantage of this approach is its complexity `O(n^2)` in the length of the
  // linked list of changes.
  convertCoordinateSystemForChanges_ (changes) {
    var self = this
    var indexFromPos = function (pos) {
      return self.codeMirror.indexFromPos(pos)
    }

    function updateIndexFromPos (indexFromPos, change) {
      return function (pos) {
        if (posLe(pos, change.from)) { return indexFromPos(pos) }
        if (posLe(change.to, pos)) {
          return indexFromPos({
            line: pos.line + change.text.length - 1 - (change.to.line - change.from.line),
            ch: (change.to.line < pos.line)
                ? pos.ch
                : (change.text.length <= 1)
                    ? pos.ch - (change.to.ch - change.from.ch) + sumLengths(change.text)
                    : pos.ch - change.to.ch + last(change.text).length
          }) + sumLengths(change.removed) - sumLengths(change.text)
        }
        if (change.from.line === pos.line) {
          return indexFromPos(change.from) + pos.ch - change.from.ch
        }
        return indexFromPos(change.from) +
            sumLengths(change.removed.slice(0, pos.line - change.from.line)) +
            1 + pos.ch
      }
    }

    var newChanges = []
    for (var i = changes.length - 1; i >= 0; i--) {
      var change = changes[i]
      indexFromPos = updateIndexFromPos(indexFromPos, change)

      var start = indexFromPos(change.from)

      var removedText = change.removed.join('\n')
      var text = change.text.join('\n')
      newChanges.unshift({ start: start,
        end: start + removedText.length,
        removed: removedText,
        text: text,
        origin: change.origin})
    }
    return newChanges
  }

  /**
   * Detects whether any line sentinel characters were added or removed by the change and if so,
   * re-marks line sentinel characters on the affected range of lines.
   * @param changes
   * @private
   */
  markLineSentinelCharactersForChanges_ (changes) {
    // TODO: This doesn't handle multiple changes correctly (overlapping, out-of-oder, etc.).
    // But In practice, people using firepad for rich-text editing don't batch multiple changes
    // together, so this isn't quite as bad as it seems.
    var startLine = Number.MAX_VALUE
    var endLine = -1

    for (var i = 0; i < changes.length; i++) {
      var change = changes[i]
      var line = change.from.line, ch = change.from.ch

      if (change.removed.length > 1 || change.removed[0].indexOf(LineSentinelCharacter) >= 0) {
        // We removed 1+ newlines or line sentinel characters.
        startLine = Math.min(startLine, line)
        endLine = Math.max(endLine, line)
      }

      if (change.text.length > 1) { // 1+ newlines
        startLine = Math.min(startLine, line)
        endLine = Math.max(endLine, line + change.text.length - 1)
      } else if (change.text[0].indexOf(LineSentinelCharacter) >= 0) {
        startLine = Math.min(startLine, line)
        endLine = Math.max(endLine, line)
      }
    }

    // HACK: Because the above code doesn't handle multiple changes correctly, endLine might be invalid.  To
    // avoid crashing, we just cap it at the line count.
    endLine = Math.min(endLine, this.codeMirror.lineCount() - 1)

    this.markLineSentinelCharactersForChangedLines_(startLine, endLine)
  }

  markLineSentinelCharactersForChangedLines_ (startLine, endLine) {
    // Back up to first list item.
    if (startLine < Number.MAX_VALUE) {
      while (startLine > 0 && this.lineIsListItemOrIndented_(startLine - 1)) {
        startLine--
      }
    }

    // Advance to last list item.
    if (endLine > -1) {
      var lineCount = this.codeMirror.lineCount()
      while (endLine + 1 < lineCount && this.lineIsListItemOrIndented_(endLine + 1)) {
        endLine++
      }
    }

    // keeps track of the list number at each indent level.
    var listNumber = []

    var cm = this.codeMirror
    for (var line = startLine; line <= endLine; line++) {
      var text = cm.getLine(line)

      // Remove any existing line classes.
      var lineHandle = cm.getLineHandle(line)
      cm.removeLineClass(lineHandle, 'text', '.*')

      if (text.length > 0) {
        var markIndex = text.indexOf(LineSentinelCharacter)
        while (markIndex >= 0) {
          var markStartIndex = markIndex

          // Find the end of this series of sentinel characters, and remove any existing markers.
          while (markIndex < text.length && text[markIndex] === LineSentinelCharacter) {
            var marks = cm.findMarksAt({ line: line, ch: markIndex })
            for (var i = 0; i < marks.length; i++) {
              if (marks[i].isForLineSentinel) {
                marks[i].clear()
              }
            }

            markIndex++
          }

          this.markLineSentinelCharacters_(line, markStartIndex, markIndex, listNumber)
          markIndex = text.indexOf(LineSentinelCharacter, markIndex)
        }
      } else {
        // Reset all indents.
        listNumber = []
      }
    }
    return endLine
  }

  emptySelection_ () {
    var start = this.codeMirror.getCursor('start')
    var end = this.codeMirror.getCursor('end')
    return (start.line === end.line && start.ch === end.ch)
  }
  computeChangedAttributes_ (oldAttrs, newAttrs, changed, inverseChanged) {
    var attrs = { }, attr
    for (attr in oldAttrs) { attrs[attr] = true }
    for (attr in newAttrs) { attrs[attr] = true }

    for (attr in attrs) {
      if (!(attr in newAttrs)) {
        // it was removed.
        changed[attr] = false
        inverseChanged[attr] = oldAttrs[attr]
      } else if (!(attr in oldAttrs)) {
        // it was added.
        changed[attr] = newAttrs[attr]
        inverseChanged[attr] = false
      } else if (oldAttrs[attr] !== newAttrs[attr]) {
        // it was changed.
        changed[attr] = newAttrs[attr]
        inverseChanged[attr] = oldAttrs[attr]
      }
    }
  }
}

export default RichTextCodeMirror
