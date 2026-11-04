import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { MediStockProvider } from './data/store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MediStockProvider>
      <App />
    </MediStockProvider>
  </React.StrictMode>
);

