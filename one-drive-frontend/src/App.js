import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FileList from './components/fileList/fileList';
import Callback from './components/Callback';
import Login from './components/login/Login';
import ErrorBoundary from './components/Errorboundary'; // Import the ErrorBoundary

function App() {
  return (
    <Router>
      <div className="App">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/files" element={<FileList />} />
            <Route path="/callback" element={<Callback />} />
          </Routes>
        </ErrorBoundary>
      </div>
    </Router>
  );
}

export default App;
