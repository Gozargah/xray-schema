import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./main.css";

document.documentElement.classList.add("dark");

createRoot(document.getElementById("root")!).render(<App />);
