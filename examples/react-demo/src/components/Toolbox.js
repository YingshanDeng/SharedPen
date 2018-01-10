import React, { Component } from 'react';
import ToolboxHeader from './ToolboxHeader'
import ToolboxToolbar from './ToolboxToolbar'

export default class Toolbox extends Component {
  render() {
    return (
      <div className="toolbox">
        <ToolboxHeader />
        <ToolboxToolbar />
      </div>
    );
  }
}
