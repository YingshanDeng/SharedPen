import React, { Component } from 'react';
import './App.css'
import Editor from './components/Editor'
import Toolbox from './components/Toolbox'

class App extends Component {
  componentDidMount() {
    // Todo 在这里初始化 sharedpen
    //
    let url = `${window.location.protocol}//${window.location.hostname}`
    if (process.env.NODE_ENV === 'development') {
      url += ':4000'
    }
    this.sharedPen = new window.SharedPen(this.textarea, url)
  }
  render() {
    return (
      <div className="app">
        <Toolbox />
        <Editor textareaRef={el => this.textarea = el} />
      </div>
    );
  }
}

export default App;
