import React, { Component } from 'react';
import styles from './DropdownList.css'

export default class DropdownList extends Component {
  _onClick(evt) {
    let _value = evt.target && evt.target.getAttribute('value')

    this.props.onExecCommand(this.props.type, _value)
    this.props.onAfterExecCmd(this.props.type)
  }
  _renderList(list) {
    return list.map((item, index) => {
      let _style = {}
      if (this.props.type === 'font') {
        _style = {fontFamily: item}
      }
      return (
        <div
          key={index}
          value={item}
          style={_style}
          className={styles.listItem}
          data-selected={item === this.props.selected}
          onClick={e => this._onClick(e)}>{item}</div>
      )
    })
  }
  render() {
    let _style = (this.props.isOpen && this.props.position) ? {
      display: "block",
      left: `${this.props.position.left}px`,
      top: `${this.props.position.top}px`
    } : { display: "none" }

    return (
      <div
        style={_style}
        className={styles.dropdownList}
        ref={el => this.dropdownList = el}>
        {this._renderList(this.props.list)}
      </div>
    )
  }
}
