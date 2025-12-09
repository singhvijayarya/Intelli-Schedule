import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import Preloader from "@/components/Preloader";  // ← ADD THIS LINE

createRoot(document.getElementById("root")!).render(
  <>
    <Preloader />   {/* ← Loading screen shown for ~700ms */}
    <App />
  </>
);
// src/main.tsx
// import React from "react";
// import { createRoot } from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import App from "./App";
// import "./index.css";
// import Preloader from "@/components/Preloader";
// import { AuthProvider } from "@/contexts/AuthContext"; // ensure this path is correct

// createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <AuthProvider>
//         <Preloader />
//         <App />
//       </AuthProvider>
//     </BrowserRouter>
//   </React.StrictMode>
// );
