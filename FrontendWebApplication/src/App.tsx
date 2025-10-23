import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DeviceList } from './routes/DeviceList';
import { DeviceDetail } from './routes/DeviceDetail';
import { DeviceCreate } from './routes/DeviceCreate';
import { DeviceEdit } from './routes/DeviceEdit';
import './styles.css';

// PUBLIC_INTERFACE
export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DeviceList />} />
        <Route path="/devices/new" element={<DeviceCreate />} />
        <Route path="/devices/:id" element={<DeviceDetail />} />
        <Route path="/devices/:id/edit" element={<DeviceEdit />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
