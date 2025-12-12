import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Transfer from "../pages/Transfer";
import Wallet from "../pages/Wallet";
import Support from "../pages/Support";
import Contact from "../pages/Contact";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/transfer", element: <Transfer /> },
      { path: "/wallet", element: <Wallet /> },
      { path: "/support", element: <Support /> },
      { path: "/contact", element: <Contact /> },
    ],
  },
]);

export default router;

