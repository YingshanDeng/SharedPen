import React, { Component } from 'react';
import styles from './ToolboxHeader.css'

export default class ToolboxHeader extends Component {
  _renderClientList(clients) {
    return clients.map(client => {
      return (
        <div
          key={client.id}
          className={styles.avatarWrapper}
          style={{backgroundColor: `${client.color}`}}>
          <div className={styles.avatar}>{client.name[0].toUpperCase()}</div>
        </div>
      )
    })
  }

  render() {
    let isExcess = this.props.clients.length > (window.innerWidth-200) / 50
    return (
      <div className={styles.toolboxHeader}>
        <div className={styles.icon}>SharedPen</div>
        <div className={styles.wrapper}>
          <div className={`${styles.userList} ${isExcess ? styles.excess : ''}`}>
            {this._renderClientList(this.props.clients)}
          </div>
          <button className={styles.invitation}></button>
        </div>
      </div>
    );
  }
}
