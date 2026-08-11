import React from "react";
import AuthPage from "./pages/AuthPage";
import { BrowserRouter, Routes,Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/profile" element={  <ProtectedRoute>
        <Dashboard/>
      </ProtectedRoute>} />
    
    </Routes>
    </BrowserRouter>
  );
}
    

export default App;