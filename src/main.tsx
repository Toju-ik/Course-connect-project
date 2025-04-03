
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { register as registerServiceWorker } from './serviceWorkerRegistration';

// Create root and render app within Router context
createRoot(document.getElementById("root")!).render(
  <Router>
    <App />
  </Router>
);

// Register service worker for PWA functionality
registerServiceWorker();
