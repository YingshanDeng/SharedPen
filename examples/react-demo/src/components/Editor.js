import React, { Component } from 'react';
import styles from './Editor.css'

export default class Editor extends Component {
  render() {
    return (
      <div className={styles.editor}>
        <div className={styles.codemirrorContainer}>
          <textarea ref={this.props.textareaRef} ></textarea>
        </div>
      </div>
    );
  }
}

