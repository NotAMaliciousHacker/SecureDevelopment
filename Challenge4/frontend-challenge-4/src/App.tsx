import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginForm from './LoginForm';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/" element={<h2>Home Page</h2>} />
      <Route path="/dashboard" element={<h2>Dashboard</h2>} />
    </Routes>
  );
};

export default App;
