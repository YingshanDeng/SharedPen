import React, { Component } from 'react';
import './codemirror.css'
import './Editor.css'

export default class Editor extends Component {
  // constructor(props) {
  //   super(props)
  // }
  render() {
    return (
      <div className="editor">
        <div className="codemirror-container">
          <textarea ref={this.props.textareaRef} ></textarea>
        </div>
      </div>
    );
  }
}

