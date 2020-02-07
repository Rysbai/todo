import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from "history";
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import App from './App';
import * as serviceWorker from './serviceWorker';

export const history = createBrowserHistory();
ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
