import "@fontsource/atkinson-hyperlegible/latin-400.css";
import "@fontsource/atkinson-hyperlegible/latin-700.css";
import "@fontsource/pixelify-sans/latin-500.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createApi } from "./api";
import { App } from "./App";
import "./styles.css";

const root = document.getElementById("root");
if (root === null) {
    throw new Error("index.html has no #root");
}
createRoot(root).render(
    <StrictMode>
        <App api={createApi()} />
    </StrictMode>,
);
