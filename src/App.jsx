import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import { useState } from "react";
import './styles/App.css';
import AuthForm from "./components/AuthForm";
import Home from "./pages/home"


  function App() {
    const [user, setUser] = useState(null); 

  return (
    <Router>
    <Routes>
      <Route path="/" element={!user ? <AuthForm setUser={setUser} /> : <Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  </Router>
     
    
  );
};

export default App;
