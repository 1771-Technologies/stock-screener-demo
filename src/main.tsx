import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "next-themes";
import { Header } from "./header.tsx";

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
      <div className="w-screen h-screen flex flex-col gap-8">
        <Header />
        <App />
      </div>
    </ThemeProvider>
  </StrictMode>
);
