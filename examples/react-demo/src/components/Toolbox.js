import React, { Component } from 'react';
import ToolboxHeader from './ToolboxHeader'
import ToolboxToolbar from './ToolboxToolbar'

export default class Toolbox extends Component {
  render() {
    return (
      <div>
        <ToolboxHeader clients={this.props.clients}/>
        <ToolboxToolbar
          attrs={this.props.attrs}
          undoStates={this.props.undoStates}
          onExecCommand={this.props.onExecCommand} />
      </div>
    );
  }
}
