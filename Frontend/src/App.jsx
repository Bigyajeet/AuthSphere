import React from "react";
import AuthPage from "./pages/AuthPage";
import { BrowserRouter, Routes,Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import GithubSuccess from "./pages/GithubSuccess";
import FacebookSuccess from "./pages/FacebookSuccess";


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/profile" element={  <ProtectedRoute>
        <Dashboard/>
      </ProtectedRoute>} />
            <Route path="/github-success" element={<GithubSuccess />} />
             <Route path="/facebook-success" element={<FacebookSuccess />} />
    </Routes>
    </BrowserRouter>
  );
}
    

export default App;