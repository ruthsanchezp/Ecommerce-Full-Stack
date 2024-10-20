import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is correctly imported
import "./index.css";
import { AuthProvider } from './context/AuthContext'; // Import the provider

ReactDOM.render(
  <React.StrictMode>
      <AuthProvider>
          <App />
      </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);