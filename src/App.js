import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import { RequireAuth } from "./auth/RequireAuth";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Pomo from "./pages/Pomo";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/dashboard" 
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              } 
            />
            <Route 
              path="/pomo" 
              element={
                <RequireAuth>
                  <Pomo />
                </RequireAuth>
              } 
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
