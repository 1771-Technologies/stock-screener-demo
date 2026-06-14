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
        "ln-light",
        "ln-dark",
        "ln-teal",
        "ln-cotton-candy",
        "ln-shadcn-light",
        "ln-shadcn-dark",
        "ln-term",
      ]}
    >
      <div className="w-screen h-screen flex flex-col gap-8">
        <Header />
        <App />
      </div>
    </ThemeProvider>
  </StrictMode>,
);
