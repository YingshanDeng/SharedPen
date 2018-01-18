import React, { Component } from 'react';
import styles from './NormalButton.css'
import tooltipStyles from  './Tooltip.css'

export default class NormalButton extends Component {
  render() {
    return (
      <div className={`${styles.normalButton} ${tooltipStyles.tooltip}`} data-tooltip={this.props.tooltip}>
        <button
          data-selected={this.props.selected}
          data-disabled={this.props.disabled}
          onClick={e => this.props.onExecCommand(this.props.type) }>
          <div
            className={styles.icon}
            style={{content: `url(${this.props.icon})`}}></div>
        </button>
      </div>
    );
  }
}
