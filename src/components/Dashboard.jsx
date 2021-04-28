import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  AccountCircle,
  ExpandLess,
  ExpandMore,
  Explore
} from '@material-ui/icons';
import {
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse
} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import MapIcon from '@material-ui/icons/Map';
import TrafficIcon from '@material-ui/icons/Traffic';
import SatelliteIcon from '@material-ui/icons/Satellite';
import TerrainIcon from '@material-ui/icons/Terrain';
import TimelineIcon from '@material-ui/icons/Timeline';
import MenuIcon from '@material-ui/icons/Menu';
import { useSelector } from 'react-redux';
import Maps from './Maps';
import EditProfile from './EditProfile';
import ListTimelines from './ListTimelines';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 36
  },
  menuButtonHidden: {
    display: 'none'
  },
  title: {
    flexGrow: 1
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9)
    }
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto'
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column'
  },
  fixedHeight: {
    height: 240
  },
  nested: {
    paddingLeft: theme.spacing(4)
  }
}));

const Dashboard = () => {
  const user = useSelector((state) => state.Auth.user);

  const [display, setDisplay] = useState('maps');
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [timelineOpen, setTimelineOpen] = useState(false);

  const [timelines, setTimelines] = useState([]);

  const [traffic, setTraffic] = useState(false);

  const [mapType, setMapType] = useState('roadmap');

  const [histoOrigin, setHistoOrigin] = useState();
  const [histoDest, setHistoDest] = useState();

  const displayTimeline = () => {
    const content = timelines.map((elem, index) => {
      const text = `${elem.origin} - ${elem.destination}`;
      return (
        <ListItem key={text} button>
          <ListItemText
            primary={text}
            onClick={() => {
              setHistoOrigin(timelines[index].origin);
              setHistoDest(timelines[index].destination);
            }}
          />
        </ListItem>
      );
    });
    return content;
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position='absolute'
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge='start'
            color='inherit'
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component='h1'
            variant='h6'
            color='inherit'
            noWrap
            className={classes.title}
          >
            {user && `Bonjour ${user.username}`}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant='permanent'
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose)
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <Typography
            component='h1'
            variant='h6'
            color='inherit'
            noWrap
            className={classes.title}
          >
            My Maps
          </Typography>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem
            button
            onClick={() => {
              setDisplay('profil');
            }}
          >
            <ListItemIcon>
              <AccountCircle />
            </ListItemIcon>
            <ListItemText primary='Compte' />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              setDisplay('savedTimeline');
            }}
          >
            <ListItemIcon>
              <Explore />
            </ListItemIcon>
            <ListItemText primary='Trajets enregistrés' />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem
            button
            onClick={() => {
              setMapType('roadmap');
              setDisplay('maps');
            }}
          >
            <ListItemIcon>
              <MapIcon />
            </ListItemIcon>
            <ListItemText primary='Map' />
          </ListItem>
          <ListItem button onClick={() => setMapType('satellite')}>
            <ListItemIcon>
              <SatelliteIcon />
            </ListItemIcon>
            <ListItemText primary='Satellite' />
          </ListItem>
          <ListItem button onClick={() => setMapType('terrain')}>
            <ListItemIcon>
              <TerrainIcon />
            </ListItemIcon>
            <ListItemText primary='Terrain' />
          </ListItem>
          <ListItem button onClick={() => setTraffic(!traffic)}>
            <ListItemIcon>
              <TrafficIcon />
            </ListItemIcon>
            <ListItemText primary='Traffic' />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button onClick={() => setTimelineOpen(!timelineOpen)}>
            <ListItemIcon>
              <TimelineIcon />
            </ListItemIcon>
            <ListItemText primary='Historique' />
            {timelineOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={timelineOpen} timeout='auto' unmountOnExit>
            <List component='div' disablePadding>
              {displayTimeline()}
            </List>
          </Collapse>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        {display === 'maps' && (
          <Maps
            mapType={mapType}
            traffic={traffic}
            setTimelines={setTimelines}
            histoOrigin={histoOrigin}
            histoDest={histoDest}
          />
        )}
        {display === 'profil' && <EditProfile />}
        {display === 'savedTimeline' && (
          <ListTimelines
            setDisplay={setDisplay}
            setHistoDest={setHistoDest}
            setHistoOrigin={setHistoOrigin}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
