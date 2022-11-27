{{#jsx}}
{{#react}}
import * as React from 'react';
{{/react}}
{{#preact}}
import { h } from 'preact';
{{/preact}}
import './App.css';

export default () => {
  return (
    {{#react}}
    <div className="App">
    {{/react}}
    {{#preact}}
    <div class="App">
    {{/preact}}
      hello
    </div>
  );
}
{{/jsx}}
