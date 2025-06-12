// DashboardLayout.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Box, CssBaseline, Divider, Grid, Paper } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';

const drawerWidth = 220;

const DashboardLayout = ({ children }) => (
  <Box sx={{ display: 'flex' }}>
    <CssBaseline />
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: '#e53935' }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Gama Express Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', background: '#fff' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <ListItem button>
            <ListItemIcon><DashboardIcon color="error" /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button>
            <ListItemIcon><InventoryIcon color="error" /></ListItemIcon>
            <ListItemText primary="Products" />
          </ListItem>
          <ListItem button>
            <ListItemIcon><PeopleIcon color="error" /></ListItemIcon>
            <ListItemText primary="Users" />
          </ListItem>
          <ListItem button>
            <ListItemIcon><BarChartIcon color="error" /></ListItemIcon>
            <ListItemText primary="Reports" />
          </ListItem>
        </List>
        <Divider />
      </Box>
    </Drawer>
    <Box
      component="main"
      sx={{ flexGrow: 1, bgcolor: '#f5f5f5', p: 3, minHeight: '100vh' }}
    >
      <Toolbar />
      {/* Example dashboard content */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 120 }}>
            <Typography variant="h6">Total Products</Typography>
            <Typography variant="h4" color="error">1,234</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 120 }}>
            <Typography variant="h6">Active Users</Typography>
            <Typography variant="h4" color="error">567</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 120 }}>
            <Typography variant="h6">Orders</Typography>
            <Typography variant="h4" color="error">89</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, height: 340 }}>
            <Typography variant="h6" gutterBottom>Sales Chart</Typography>
            {/* Place your chart component here */}
            <Box sx={{ height: 280, background: '#eee', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">[Chart Placeholder]</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      {/* Render children if needed */}
      {children}
    </Box>
  </Box>
);

export default DashboardLayout;