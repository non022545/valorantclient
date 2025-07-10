import React, { useState } from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import Contact from './pages/Contact.jsx';
import Admin from './pages/Admin.jsx';
import Login from './pages/Login.jsx';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = createBrowserRouter([
    { path: '/', element: <Home /> },
    { path: '/Shop', element: <Shop /> },
    { path: '/Contact', element: <Contact /> },
    { path: '/Admin_Npass_non0625232145', element: <Admin isLoggedIn={isLoggedIn} /> },
    { path: '/login', element: <Login onLogin={setIsLoggedIn} /> },
  ]);

  return <RouterProvider router={router} />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
