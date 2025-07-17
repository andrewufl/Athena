import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { store } from './store';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Campaigns } from './pages/Campaigns';
import { Workspaces } from './pages/Workspaces';
import { Settings } from './pages/Settings';
import { CampaignNew } from './pages/CampaignNew';
import { CampaignAnalytics } from './pages/CampaignAnalytics';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/campaigns/new" element={<CampaignNew />} />
            <Route path="/campaigns/:id/analytics" element={<CampaignAnalytics />} />
            <Route path="/workspaces" element={<Workspaces />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
