import { createRoot } from "react-dom/client";
// Order matters: Tailwind (reset, components, utilities) first, then the Kairos design language on top,
// so token-driven element styles (h1, p, a) win over the Tailwind reset.
import "./index.css";
import "./styles/globals.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(<App />);
