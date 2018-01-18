import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import CodeMirror from '../node_modules/codemirror/lib/codemirror.js'
import io from '../node_modules/socket.io-client/dist/socket.io.js'

window.CodeMirror = CodeMirror
window.io = io

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
