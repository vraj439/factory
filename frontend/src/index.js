import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {configDotenv} from "dotenv";

configDotenv();
ReactDOM.render(<App/>, document.getElementById('root'));
