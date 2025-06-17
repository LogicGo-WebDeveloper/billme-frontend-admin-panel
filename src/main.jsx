import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import QueryProvider from "./query-providers/QueryProvider.jsx";
import { Provider } from "react-redux";
import { store, persistor } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
