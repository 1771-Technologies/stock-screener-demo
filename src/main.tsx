import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "next-themes";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider
      attribute="class"
      themes={[
        "light",
        "dark",
        "lng1771-teal",
        "lng1771-cotton-candy",
        "lng1771-shadcn-light",
        "lng1771-shadcn-dark",
        "lng1771-term256",
      ]}
    >
      <App />
    </ThemeProvider>
  </StrictMode>
);
