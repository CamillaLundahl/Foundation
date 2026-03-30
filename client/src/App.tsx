import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./pages/Profile/Profile";
import Exercises from "./pages/Exercises/Exercises";
import Programs from "./pages/Programs/Programs";

const routes = [
  { path: "/", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/profile", element: <Profile /> },
  { path: "/exercises", element: <Exercises /> },
  { path: "/programs", element: <Programs /> },
];

/**
 * App Component
 * This is the root component of the application.
 * It sets up the React Router for navigation and defines the main layout structure.
 */
function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} {...route} />
          ))}
        </Routes>
      </main>
    </Router>
  );
}

export default App;
