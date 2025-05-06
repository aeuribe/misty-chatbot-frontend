import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import App from "./App.jsx";
import "./main.css";
import { Auth0Provider } from "@auth0/auth0-react";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#fff",
    },
  },
});

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const client_id = import.meta.env.VITE_AUTH0_CLIENT_ID;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <BrowserRouter>
            <Auth0Provider
              domain={domain}
              clientId={client_id}
              authorizationParams={{
                redirect_uri: "https://localhost:5173/dashboard",
                audience:"https://chatbot-backend/",
              }}
            >
              <App />
            </Auth0Provider>
          </BrowserRouter>
        </LocalizationProvider>
    </ThemeProvider>
  </StrictMode>
);
