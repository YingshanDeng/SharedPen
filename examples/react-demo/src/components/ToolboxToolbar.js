import React, { Component } from 'react';
import NormalButton from './toolbar/NormalButton'
import styles from './ToolboxToolbar.css'

// icons
import UndoIcon from '../images/undo.svg'
import RedoIcon from '../images/redo.svg'

import BoldIcon from '../images/bold.svg'
import ItalicIcon from '../images/italic.svg'
import UnderlineIcon from '../images/underline.svg'
import StrikeIcon from '../images/strike.svg'

import AlignLeftIcon from '../images/align-left.svg'
import AlignCenterIcon from '../images/align-center.svg'
import AlignRightIcon from '../images/align-right.svg'
import AlignJustifyIcon from '../images/align-justify.svg'

import OrderedListIcon from '../images/ordered-list.svg'
import UnorderedListIcon from '../images/unordered-list.svg'
import TodoListIcon from '../images/todo-list.svg'

import IndentIcon from '../images/indent.svg'
import UnindentIcon from '../images/unindent.svg'

import LinkIcon from '../images/link.svg'
import ImageIcon from '../images/image.svg'

export default class ToolboxToolbar extends Component {
  constructor(props) {
    super(props)

    this.items = {
      formatItems: [{
        type: 'bold',
        tooltip: '',
        icon: BoldIcon
      }, {
        type: 'italic',
        tooltip: '',
        icon: ItalicIcon
      }, {
        type: 'underline',
        tooltip: '',
        icon: UnderlineIcon
      }, {
        type: 'strike',
        tooltip: '',
        icon: StrikeIcon
      }],
      alignItems: [{
        type: 'align-left',
        tooltip: 'Left align (⌘+Shift+L)',
        icon: AlignLeftIcon
      }, {
        type: 'align-center',
        tooltip: 'Center align (⌘+Shift+E)',
        icon: AlignCenterIcon
      }, {
        type: 'align-right',
        tooltip: 'Right align (⌘+Shift+R)',
        icon: AlignRightIcon
      }, {
        type: 'align-justify',
        tooltip: 'Justify (⌘+Shift+J)',
        icon: AlignJustifyIcon
      }],
      listItems: [{
        type: 'ordered-list',
        tooltip: '',
        icon: OrderedListIcon
      }, {
        type: 'unordered-list',
        tooltip: '',
        icon: UnorderedListIcon
      }, {
        type: 'todo-list',
        tooltip: '',
        icon: TodoListIcon
      }],
      indentItems: [{
        type: 'indent',
        tooltip: 'Indent (⌘[)',
        icon: IndentIcon
      }, {
        type: 'unindent',
        tooltip: 'Unindent (⌘[)',
        icon: UnindentIcon
      }],
      entityItems: [{
        type: 'link',
        tooltip: '',
        icon: LinkIcon
      }, {
        type: 'image',
        tooltip: '',
        icon: ImageIcon
      }]
    }
  }
  // 文本属性按键监听是否选中
  _monitorAttrsSelected(t, curAttrs) {
    if (!curAttrs) { return false }
    switch (t) {
      case 'bold': return this._checkedSelectedStates(curAttrs, 'b')
      case 'italic': return this._checkedSelectedStates(curAttrs, 'i')
      case 'underline': return this._checkedSelectedStates(curAttrs, 'u')
      case 'strike': return this._checkedSelectedStates(curAttrs, 's')

      case 'align-left':
      case 'align-center':
      case 'align-right':
      case 'align-justify':
        var laValue = t.substr(t.indexOf('-')+1)
        return this._checkedSelectedStates(curAttrs, 'la', laValue)

      case 'ordered-list': return this._checkedSelectedStates(curAttrs, 'lt', 'o')
      case 'unordered-list': return this._checkedSelectedStates(curAttrs, 'lt', 'u')
      case 'todo-list': return this._checkedSelectedStates(curAttrs, 'lt')
    }
  }
  _getCurrentAttrsValue(t, curAttrs) {
    const getValue = (t, curAttrs) => {
      if (curAttrs && (t in curAttrs)) {
        if (t === 'fs') {
          return parseInt(curAttrs[t])
        }
        return curAttrs[t]
      } else if (t === 'c') {
        return 'rgb(0, 0, 0)'
      } else if (t === 'bc') {
        return 'rgb(255, 255, 255)'
      } else if (t === 'f') {
        return 'Arial'
      } else if (t === 'fs') {
        return '16'
      }
    }

    switch (t) {
      case 'font': return getValue('f', curAttrs);
      case 'font-size': return getValue('fs', curAttrs);
      case 'color': return getValue('c', curAttrs);
      case 'highlight': return getValue('bc', curAttrs);
    }
  }
  _checkedSelectedStates(curAttrs, t, value) {
    if (t in curAttrs) {
      if (t === 'lt' && !value) {
        return curAttrs[t] === 't' || curAttrs[t] === 'tc';
      } else {
        return curAttrs[t] === true || curAttrs[t] === value;
      }
    } else if (t === 'la') {
      return value === 'left' // align default: left
    } else {
      return false
    }
  }

  _renderNormalButtonItems(items) {
    return items.map(item => {
      return (
        <NormalButton
          key={item.type}
          type={item.type}
          icon={item.icon}
          tooltip={item.tooltip}
          selected={this._monitorAttrsSelected(item.type, this.props.attrs)}
          onExecCommand={this.props.onExecCommand} />
      )
    })
  }

  render() {
    return (
      <div className={styles.toolboxToolbar}>
        <NormalButton
          type="undo"
          icon={UndoIcon}
          disabled={!this.props.undoStates.canUndo}
          onExecCommand={this.props.onExecCommand} />
        <NormalButton
          type="redo"
          icon={RedoIcon}
          disabled={!this.props.undoStates.canRedo}
          onExecCommand={this.props.onExecCommand} />
        <div className={styles.toolbarSeparator}></div>

        {this._renderNormalButtonItems(this.items.formatItems)}
        <div className={styles.toolbarSeparator}></div>

        {this._renderNormalButtonItems(this.items.alignItems)}
        <div className={styles.toolbarSeparator}></div>

        {this._renderNormalButtonItems(this.items.listItems)}
        <div className={styles.toolbarSeparator}></div>

        {this._renderNormalButtonItems(this.items.indentItems)}
        <div className={styles.toolbarSeparator}></div>

        {this._renderNormalButtonItems(this.items.entityItems)}
      </div>
    );
  }
}
