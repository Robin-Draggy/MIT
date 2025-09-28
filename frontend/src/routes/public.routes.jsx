import { Navigate } from "react-router-dom";
import { Login } from "../pages/login/Login";
import { Register } from "../pages/login/Register";

export const publicRoutes = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "*",
    element: <Navigate to="/login" />,
  },
];
