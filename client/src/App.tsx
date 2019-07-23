import React from 'react';
import logo from './logo.svg';
import './app.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <span>
          这是测试栗子，哈
        </span>
      </header>
    </div>
  );
}

export default App;
