import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./index.css";

const container = document.getElementById("app");
if (!container) throw new Error("#app não encontrado");
createRoot(container).render(<App />);
