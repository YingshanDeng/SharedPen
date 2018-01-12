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


export default class ToolboxToolbar extends Component {
  constructor(props) {
    super(props)

  }
  onExecCommand(command, value) {
    console.log('---', command, value)
  }

  _renderUndoRedoBtns(undoStates) {

  }

  render() {
    console.log('====', this.props.attrs)
    return (
      <div className={styles.toolboxToolbar}>
        <NormalButton
          type="undo"
          icon={UndoIcon}
          selected={true}
          onExecCommand={(c, v) => this.onExecCommand(c, v) } />
        <NormalButton
          type="redo"
          icon={RedoIcon}
          onExecCommand={(c, v) => this.onExecCommand(c, v) } />
        <div className={styles.toolbarSeparator}></div>

        <NormalButton
          type="bold"
          icon={BoldIcon}
          onExecCommand={(c, v) => this.onExecCommand(c, v) } />
        <NormalButton
          type="italic"
          icon={ItalicIcon}
          onExecCommand={(c, v) => this.onExecCommand(c, v) } />
        <NormalButton
          type="underline"
          icon={UnderlineIcon}
          onExecCommand={(c, v) => this.onExecCommand(c, v) } />
        <NormalButton
          type="strike"
          icon={StrikeIcon}
          onExecCommand={(c, v) => this.onExecCommand(c, v) } />
        <div className={styles.toolbarSeparator}></div>

        <NormalButton
          type="align-left"
          icon={AlignLeftIcon}
          onExecCommand={(c, v) => this.onExecCommand(c, v) } />
        <NormalButton
          type="align-center"
          icon={AlignCenterIcon}
          onExecCommand={(c, v) => this.onExecCommand(c, v) } />
        <NormalButton
          type="align-right"
          icon={AlignRightIcon}
          onExecCommand={(c, v) => this.onExecCommand(c, v) } />
        <NormalButton
          type="align-justify"
          icon={AlignJustifyIcon}
          onExecCommand={(c, v) => this.onExecCommand(c, v) } />
        <div className={styles.toolbarSeparator}></div>

      </div>
    );
  }
}
