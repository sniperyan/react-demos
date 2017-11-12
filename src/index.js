import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './example/demo1';
//import App from './example/demo2';
//import App from './example/demo3';
import App from './react-router/app';
//import App from './example/deepCopy';

import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
