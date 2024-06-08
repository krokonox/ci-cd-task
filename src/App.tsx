import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Stop wasting paper!
        </p>
        <a
          className="App-link"
          href="https://happyops.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Digitilize your factory
        </a>
      </header>
    </div>
  );
}

export default App;
