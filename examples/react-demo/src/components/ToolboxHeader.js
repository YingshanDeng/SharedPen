import React, { Component } from 'react';
import './ToolboxHeader.css'

export default class ToolboxHeader extends Component {
  constructor(props) {
    super(props)
  }
  _onTapInvitation(e) {
    console.log('--', e)
  }

  render() {
    return (
      <div className="toolbox-header">
        <div className="icon">SharedPen</div>
        <div className="wrapper">
          <div className="user-list">
            <template is="dom-repeat" items="[[clients]]" as="client">
              <div className="avatar-wrapper">
                <div className="avatar">[[_parseUserName(client.name)]]</div>
              </div>
            </template>
          </div>
          <button className="invitation" onClick={e => this._onTapInvitation(e)}></button>
        </div>
      </div>
    );
  }
}
