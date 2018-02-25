import React, { Component } from 'react';
import styles from './HighlightButton.css'
import tooltipStyles from  './Tooltip.css'

export default class HighlightButton extends Component {
  _onClick(evt) {
    if (this.button.hasAttribute('data-selected')) {
      this.button.removeAttribute('data-selected')
      this.props.onPalette(false)
    } else {
      this.button.setAttribute('data-selected', 'true')
      let _rect = this.button.getBoundingClientRect()
      this.props.onPalette(true, this.props.value, {
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
        style={{width: "40px", minWidth: "40px"}}
        className={tooltipStyles.tooltip}
        onClick={e => this._onClick(e)}>
        <div className={styles.icon} style={{backgroundColor: this.props.value}}></div>
        <div className={styles.dropdown}></div>
      </button>
    );
  }
}
