import React from 'react';
import './App.css';

function App() {
  function authorize(e) {
    e.preventDefault();
    console.log('the link was clicked')
  }
  return (
    <div className="App">
      <h1>TOPFEED</h1>
      <button onClick={authorize}>Authorize with Instagram</button>
    </div>
  );
}

export default App;
