import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import { seedIfNeeded } from './features/grow-strong/db';
import './styles.css';
import './features/springs-guide/springs-guide.css';

registerSW({ immediate: true });

seedIfNeeded().then(() => ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><HashRouter><App /></HashRouter></React.StrictMode>));
