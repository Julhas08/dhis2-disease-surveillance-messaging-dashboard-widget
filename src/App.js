import React, { Component } from 'react';
import './App.css';
import GetValidationsResult from './components/GetValidationsResult';
class App extends Component {
  render() {
    return (
      <div className="main-area">
        <div className="panel-white">
          <div className="panel-body">
              <GetValidationsResult />
          </div>
        </div>

      </div>
    );
  }
}

export default App;
