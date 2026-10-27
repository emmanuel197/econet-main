import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/store";
import App from "./App.jsx";
import { setupAuthInterceptor } from "./api/refreshToken";

setupAuthInterceptor(); // single global axios 401→refresh handler

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
