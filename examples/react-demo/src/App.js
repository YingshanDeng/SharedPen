import React, { Component } from 'react';
import './SharedStyle.css'
import styles from './App.css'
import Editor from './components/Editor'
import Toolbox from './components/Toolbox'

class App extends Component {
  constructor(props) {
    super(props)
    // init state
    this.state = {
      // collaborative clients
      clients: [],
      // text attrs
      attrs: {},
      // undo/redo states
      undoStates: {
        canUndo: false,
        canRedo: false
      }
    }
  }

  componentDidMount() {
    let url = `${window.location.protocol}//${window.location.hostname}`
    if (process.env.NODE_ENV === 'development') {
      url += ':4000'
    }
    // initial SharedPen
    this.sharedPen = new window.SharedPen(this.textarea, url)
    this.sharedPen.on('ready', this._onReady.bind(this))
  }
  _onReady() {
    this.sharedPen.on('clientsChanged', (clients) => {
      console.log('---clients: ', clients)
      this.setState({clients})
    })
    this.sharedPen.on('realtimeTextAttrsChanged', (attrs) => {
      console.log('---', attrs)
      this.setState({attrs})
    })
    this.sharedPen.on('undoStatesChanged', (undoStates) => {
      console.log('===', undoStates)
      this.setState({undoStates})
    })
  }

  render() {
    return (
      <div className={styles.app}>
        <Toolbox {...this.state} />
        <Editor textareaRef={el => this.textarea = el} />
      </div>
    );
  }
}

export default App;
