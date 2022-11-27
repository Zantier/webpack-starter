{{#typescript}}
{{#jsx}}
{{#react}}
import * as React from 'react';
import { render } from 'react-dom';
{{/react}}
{{#preact}}
import { h, render } from 'preact';
{{/preact}}
import App from './App';
import './main.css';

render(<App/>, document.body);
{{/jsx}}
{{/typescript}}
