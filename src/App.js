import { BrowserRouter, Routes, Route } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./components/Login"
import Layout from "./components/Layout"
import Dashboard from "./pages/Dashboard"
import Resources from "./pages/Resources"
import Sched from "./pages/Sched"
import TV from "./tv/TV"
import { AuthProvider } from './components/AuthContext';
import "./App.css"

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route element={<Dashboard />} path="/dashboard" />
              <Route element={<Sched />} path="/schedule" />
              <Route element={<Resources />} path="/resources" />
              {/* <Route element={<Create />} path="/create" /> */}
            </Route>
          </Route>
          <Route element={<TV />} path="/tv"></Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;