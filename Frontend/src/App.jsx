import React from "react";
import AuthPage from "./pages/AuthPage";
import { BrowserRouter, Routes,Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import GithubSuccess from "./pages/GithubSuccess";


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/profile" element={  <ProtectedRoute>
        <Dashboard/>
      </ProtectedRoute>} />
            <Route path="/github-success" element={<GithubSuccess />} />
    
    </Routes>
    </BrowserRouter>
  );
}
    

export default App;