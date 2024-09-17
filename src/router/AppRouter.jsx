import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { lazy } from "react";

const Jobs = lazy(() => import("../_root/Pages/Jobs"));

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Jobs />,
      },
    ],
  },
]);

export default AppRouter;
