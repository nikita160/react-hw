import React, { useMemo, useState, useRef } from 'react';
import './App.css';
import Layout from './layout/Layout';
import Button from '@mui/material/Button';
import MainCard from './layout/LayoutCard';

function App() {
  return (
    <Layout>
      <MainCard />
    </Layout>
  );
}

export default App;
