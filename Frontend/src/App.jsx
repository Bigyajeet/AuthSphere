import React from "react";
import AuthPage from "./pages/AuthPage";
import { BrowserRouter, Routes,Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import GithubSuccess from "./pages/GithubSuccess";
import FacebookSuccess from "./pages/FacebookSuccess";
import LinkedInSuccess from "./pages/LinkedInSuccess";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";



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
             <Route path="/linkedin-success" element={<LinkedInSuccess/>} />
             <Route path="/forgot-password" element={<ForgotPassword/>} />
             <Route path="/reset-password/:token" element={<ResetPassword/>} />
             
    </Routes>
    </BrowserRouter>
  );
}
    

export default App;