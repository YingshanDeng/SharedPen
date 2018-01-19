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
      this.setState({clients})
    })
    this.sharedPen.on('realtimeTextAttrsChanged', (attrs) => {
      this.setState({attrs})
    })
    this.sharedPen.on('undoStatesChanged', (undoStates) => {
      this.setState({undoStates})
    })
  }
  onExecCommand(command, value) {
    console.log('[execCommand]: ', command, value)
    switch (command) {
      case 'undo': this.sharedPen.undo(); break
      case 'redo': this.sharedPen.redo(); break

      case 'font': this.sharedPen.font(value); break
      case 'font-size': this.sharedPen.fontSize(value+'px'); break

      case 'bold': this.sharedPen.bold(); break
      case 'italic': this.sharedPen.italic(); break
      case 'underline': this.sharedPen.underline(); break
      case 'strike': this.sharedPen.strike(); break

      case 'color': this.sharedPen.color(value); break
      case 'highlight': this.sharedPen.highlight(value); break

      case 'align-left':
      case 'align-center':
      case 'align-right':
      case 'align-justify': this.sharedPen.align(command.substr(command.indexOf('-')+1)); break

      case 'ordered-list': this.sharedPen.orderedList(); break
      case 'unordered-list': this.sharedPen.unorderedList(); break
      case 'todo-list': this.sharedPen.todoList(); break

      case 'indent': this.sharedPen.indent(); break
      case 'unindent': this.sharedPen.unindent(); break

      case 'link': alert('TODO: Insert Link'); break
      case 'image': alert('TODO: Insert Image'); break

      case 'format': alert('TODO: Format'); break
      case 'clear-format': alert('TODO: Clear Format'); break
      default: break
    }
  }
  _onClickExplore(e) {
    console.log('--TODO Explore--')
    alert(`SharedPen 富文本协同编辑器现阶段仍在开发中，发现BUG或者对此项目感兴趣的朋友欢迎联系我一起交流 🤝
      QQ：1012520397
      Mail: yingshandeng@gmail.com
      GitHub: https://github.com/yingshandeng/Sharedpen`)
  }
  render() {
    return (
      <div className={styles.app}>
        <Toolbox {...this.state} onExecCommand={(c, v) => this.onExecCommand(c, v)}/>
        <Editor textareaRef={el => this.textarea = el} />

        <button className={styles.explore} onClick={e => this._onClickExplore(e)}>
          <div className={styles.exploreIcon}></div>
          <span className={styles.exploreInfo}>Explore</span>
        </button>
      </div>
    )
  }
}

export default App;
