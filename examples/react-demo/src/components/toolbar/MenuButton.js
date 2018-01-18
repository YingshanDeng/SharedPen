import React, { Component } from 'react';
import styles from './MenuButton.css'
import tooltipStyles from  './Tooltip.css'

export default class MenuButton extends Component {
  _onClick(evt) {
    if (this.button.hasAttribute('data-selected')) {
      this.button.removeAttribute('data-selected')
      this.props.onDropdown(false)
    } else {
      this.button.setAttribute('data-selected', 'true')
      let _rect = this.button.getBoundingClientRect()
      this.props.onDropdown(true, this.props.list, this.props.value, {
        left: _rect.left,
        top: _rect.top + _rect.height + 2 // margin: 2
      })
    }
  }
  unSelect() {
    if (this.button.hasAttribute('data-selected')) {
      this.button.removeAttribute('data-selected')
    }
  }
  render() {
    return (
      <button
        data-tooltip={this.props.tooltip}
        ref={el => this.button = el}
        className={`${styles.menuButton} ${tooltipStyles.tooltip}`}
        onClick={e => this._onClick(e)}>
        <div
          className={styles.caption}
          style={{width: `${this.props.type === 'font' ? 70 : 45}px`}}>{this.props.value}</div>
        <div className={styles.dropdown}></div>
      </button>
    );
  }
}
