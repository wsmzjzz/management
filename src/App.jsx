import React from 'react'
import logo from './logo.svg';
import './App.less';
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { DashBoard } from './pages/dashboard/dashboard'
import { Login } from './pages/login/login'
import { Users } from './components/users/users'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<DashBoard />}>
            <Route path="/dashboard/users" element={<Users />} />
          </Route>
          <Route path="login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
