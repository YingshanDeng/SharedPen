import React, { Component } from 'react';
// components
import NormalButton from './toolbar/NormalButton'
import MenuButton from './toolbar/MenuButton'
import DropdownList from './toolbar/DropdownList'
import ColorButton from './toolbar/ColorButton'
import HighlightButton from './toolbar/HighlightButton'
import ColorPalette from './toolbar/ColorPalette'
// styles
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

import FormatIcon from '../images/format.svg'
import ClearFormatIcon from '../images/clear-format.svg'

export default class ToolboxToolbar extends Component {
  constructor(props) {
    super(props)

    this.items = {
      formatItems: [{
        type: 'bold',
        tooltip: 'Bold (⌘B)',
        icon: BoldIcon
      }, {
        type: 'italic',
        tooltip: 'Italic (⌘I)',
        icon: ItalicIcon
      }, {
        type: 'underline',
        tooltip: 'Underline (⌘U)',
        icon: UnderlineIcon
      }, {
        type: 'strike',
        tooltip: 'Strike (⌘+Shift+X)',
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
        tooltip: 'Numbered list (⌘+Shift+7)',
        icon: OrderedListIcon
      }, {
        type: 'unordered-list',
        tooltip: 'Bulleted list (⌘+Shift+8)',
        icon: UnorderedListIcon
      }, {
        type: 'todo-list',
        tooltip: 'Todo list (⌘+Shift+9)',
        icon: TodoListIcon
      }],
      indentItems: [{
        type: 'unindent',
        tooltip: 'Decrease indent (⌘[)',
        icon: UnindentIcon
      }, {
        type: 'indent',
        tooltip: 'Increase indent (⌘])',
        icon: IndentIcon
      }],
      entityItems: [{
        type: 'link',
        tooltip: 'Insert link (⌘K)',
        icon: LinkIcon
      }, {
        type: 'image',
        tooltip: 'Insert image',
        icon: ImageIcon
      }]
    }

    this.state = {
      // 色板
      palette: {
        type: null,
        isOpen: false,
        selected: '',
        position: {}
      },
      // 下拉列表
      dropdown: {
        type: null,
        isOpen: false,
        list: [],
        selected: '',
        position: {}
      }
    }
  }

  componentDidMount() {
    this._clickHandler = (evt) => {
      let _target = evt.target

      if (!this.colorBtn.button.contains(_target) &&
        !this.highlightBtn.button.contains(_target) &&
        !this.palette.paletteWrapper.contains(_target)) {
        this.onPalette(this.state.palette.type, false)
      }

      if (!this.fontBtn.button.contains(_target) &&
        !this.fontSizeBtn.button.contains(_target) &&
        !this.dropdown.dropdownList.contains(_target)) {
        this.onDropdown(this.state.dropdown.type, false)
      }
    }
    this._resizeHandler = () => {
      this.onPalette(this.state.palette.type, false)
      this.onDropdown(this.state.dropdown.type, false)
    }
    document.body.addEventListener('click', this._clickHandler)
    window.addEventListener('resize', this._resizeHandler)
  }
  componentWillUnmount() {
    document.body.removeEventListener('click', this._clickHandler)
    window.removeEventListener('resize', this._resizeHandler)
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
      default: return false
    }
  }
  _getCurrentAttrsValue(t, curAttrs) {
    const getValue = (t, curAttrs) => {
      if (curAttrs && (t in curAttrs)) {
        if (t === 'fs') {
          return parseInt(curAttrs[t], 10)
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
      case 'font-size': return getValue('fs', curAttrs)
      case 'color': return getValue('c', curAttrs)
      case 'highlight': return getValue('bc', curAttrs)
      default: break
    }
  }
  _checkedSelectedStates(curAttrs, t, value) {
    if (t in curAttrs) {
      if (t === 'lt' && !value) {
        return curAttrs[t] === 't' || curAttrs[t] === 'tc'
      } else {
        return curAttrs[t] === true || curAttrs[t] === value
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

  onPalette(type, isOpen, selected, position) {
    // unselect the prev button selected state if need
    this._onUnselect(this.state.palette.type)

    this.setState({
      palette: {
        type: isOpen ? type : null,
        isOpen: isOpen,
        selected: selected || "",
        position: position || {}
      }
    })
  }
  onDropdown(type, isOpen, list, selected, position) {
    // unselect the prev button selected state if need
    this._onUnselect(this.state.dropdown.type)

    this.setState({
      dropdown: {
        type: isOpen ? type : null,
        isOpen: isOpen,
        list: list || [],
        selected: selected || '',
        position: position || {}
      }
    })
  }
  _onUnselect(type) {
    switch (type) {
      case 'font':
        this.fontBtn.unSelect()
        break;
      case 'font-size':
        this.fontSizeBtn.unSelect()
        break;
      case 'color':
        this.colorBtn.unSelect()
        break;
      case 'highlight':
        this.highlightBtn.unSelect()
        break;
      default:
        break;
    }
  }
  _onAfterExecCmd(type) {
    this._onUnselect(type)

    if (type === 'color' || type === 'highlight') {
      this.setState({
        palette: {
          type: null,
          isOpen: false,
          selected: '',
          position: {}
        }
      })
    } else if (type === 'font' || type === 'font-size') {
      this.setState({
        dropdown: {
          type: null,
          isOpen: false,
          list: [],
          selected: '',
          position: {}
        }
      })
    }
  }

  render() {
    return (
      <div className={styles.toolboxToolbar}>
        <NormalButton
          type="undo"
          icon={UndoIcon}
          tooltip="Undo (⌘Z)"
          disabled={!this.props.undoStates.canUndo}
          onExecCommand={this.props.onExecCommand} />
        <NormalButton
          type="redo"
          icon={RedoIcon}
          tooltip="Rndo (⌘Y)"
          disabled={!this.props.undoStates.canRedo}
          onExecCommand={this.props.onExecCommand} />
        <NormalButton
          type="format"
          icon={FormatIcon}
          tooltip="Paint format"
          onExecCommand={this.props.onExecCommand} />
        <div className={styles.toolbarSeparator}></div>

        <MenuButton
          type="font"
          tooltip="Font"
          list={['Arial', 'Consolas', 'Impact', 'Verdana']}
          ref={el => this.fontBtn = el}
          value={this._getCurrentAttrsValue('font', this.props.attrs)}
          onDropdown={(isOpen, list, curValue, position) => this.onDropdown('font', isOpen, list, curValue, position)} />
        <div className={styles.toolbarSeparator}></div>
        <MenuButton
          type="font-size"
          tooltip="Font size"
          list={['16', '18', '20', '24', '30', '40']}
          ref={el => this.fontSizeBtn = el}
          value={this._getCurrentAttrsValue('font-size', this.props.attrs)}
          onDropdown={(isOpen, list, curValue, position) => this.onDropdown('font-size', isOpen, list, curValue, position)} />
        <div className={styles.toolbarSeparator}></div>

        {this._renderNormalButtonItems(this.items.formatItems)}
        <div className={styles.toolbarSeparator}></div>

        <ColorButton
          tooltip="Text Color"
          ref={el => this.colorBtn = el}
          value={this._getCurrentAttrsValue('color', this.props.attrs)}
          onPalette={(isOpen, curValue, position) => this.onPalette('color', isOpen, curValue, position)} />
        <div className={styles.toolbarSeparator}></div>
        <HighlightButton
          tooltip="Text Highlight Color"
          ref={el => this.highlightBtn = el}
          value={this._getCurrentAttrsValue('highlight', this.props.attrs)}
          onPalette={(isOpen, curValue, position) => this.onPalette('highlight', isOpen, curValue, position)} />
        <div className={styles.toolbarSeparator}></div>

        {this._renderNormalButtonItems(this.items.alignItems)}
        <div className={styles.toolbarSeparator}></div>

        {this._renderNormalButtonItems(this.items.listItems)}
        <div className={styles.toolbarSeparator}></div>

        {this._renderNormalButtonItems(this.items.indentItems)}
        <div className={styles.toolbarSeparator}></div>

        {this._renderNormalButtonItems(this.items.entityItems)}
        <div className={styles.toolbarSeparator}></div>

        <NormalButton
          type="clear-format"
          tooltip="Clear formatting (⌘\)"
          icon={ClearFormatIcon}
          onExecCommand={this.props.onExecCommand} />

        <DropdownList
          {...this.state.dropdown}
          ref={el => this.dropdown = el}
          onExecCommand={this.props.onExecCommand}
          onAfterExecCmd={type => this._onAfterExecCmd(type)} />
        <ColorPalette
          {...this.state.palette}
          ref={el => this.palette = el}
          onExecCommand={this.props.onExecCommand}
          onAfterExecCmd={type => this._onAfterExecCmd(type)} />
      </div>
    )
  }
}
