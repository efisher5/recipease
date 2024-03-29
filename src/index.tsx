import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';

const VITE_LOGIN_REDIRECT_URI = import.meta.env.VITE_LOGIN_REDIRECT_URI;
const VITE_API_BASE_PATH = import.meta.env.VITE_API_BASE_PATH;
const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-jrqafy16s4gs5ji0.us.auth0.com"
      clientId="61Sejvgv0VZn3phJ3TT7aU4ntKY9lhfm"
      authorizationParams={{
        redirect_uri: VITE_LOGIN_REDIRECT_URI,
        audience: VITE_API_BASE_PATH,
      }}
    >

    <Provider store={store}>
      <App />
    </Provider>
    </Auth0Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
