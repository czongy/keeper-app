import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./components/app/App.jsx";
import Login from "./components/login/Login.jsx"
import Register from "./components/login/Register.jsx";
import { disableReactDevtools } from "@fvilers/disable-react-devtools";

if (process.env.NODE_ENV === "production") disableReactDevtools();

const root = createRoot(document.getElementById("root"));

const routes = [
  {
    basename: "/login",
    path: "/",
    element: <Login />,
  },{
    path: "/register",
    element: <Register />,
  },
  {
    path: "/app",
    element: <App />,
  }
];

const router = createBrowserRouter(routes);

root.render(
  <RouterProvider router={router} />
);