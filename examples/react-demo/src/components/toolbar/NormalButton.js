import React, { Component } from 'react';
import styles from './NormalButton.css'

export default class NormalButton extends Component {
  constructor(props) {
    super(props)
    //
  }
  // onClickHandler(e) {
  //   this.props.onExecCommand(this.props.type, 'value')
  // }

  render() {
    return (
      <div className={styles.normalButton}>
        <button
          data-selected={this.props.selected}
          data-disabled={this.props.disabled}
          onClick={e => this.props.onExecCommand(this.props.type, 'value') }>
          <div
            className={styles.icon}
            style={{content: `url(${this.props.icon})`}}></div>
        </button>
      </div>
    );
  }
}
