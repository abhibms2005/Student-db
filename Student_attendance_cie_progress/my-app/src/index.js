import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import store from "./utils/storage";
import { api } from "./utils/api";

// Expose helpers for quick dev use in browser console
try {
	window.__STORE = store;
	window.__API = api;
} catch (e) {}

const container = document.getElementById("root");
createRoot(container).render(<App />);
