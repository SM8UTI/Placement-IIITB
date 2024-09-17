import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "@material-tailwind/react";
import { RouterProvider } from "react-router-dom";
import AppRouter from "./router/AppRouter.jsx";
import { Toaster } from "react-hot-toast";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={AppRouter} />
      <Toaster
        position="top-center"
        reverseOrder={false}
        containerClassName="font-primary text-base"
      />
    </ThemeProvider>
  </StrictMode>
);
