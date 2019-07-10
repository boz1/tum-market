import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import { Router } from 'react-router-dom';
import history from './history';

ReactDOM.render(
    <Router history={history}>
        <App />
    </Router>, document.getElementById('root')
);

serviceWorker.unregister();