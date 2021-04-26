import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import {
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Container,
  Grid,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Input,
  Button
} from '@material-ui/core';
import {
  GoogleMap,
  LoadScript,
  TrafficLayer,
  DirectionsRenderer,
  DirectionsService
} from '@react-google-maps/api';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import MapIcon from '@material-ui/icons/Map';
import TrafficIcon from '@material-ui/icons/Traffic';
import SatelliteIcon from '@material-ui/icons/Satellite';
import TerrainIcon from '@material-ui/icons/Terrain';
import TimelineIcon from '@material-ui/icons/Timeline';
import MenuIcon from '@material-ui/icons/Menu';

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

export default function Dashboard() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [timelineOpen, setTimeline] = React.useState(false);

  const [timelines, setTimelines] = React.useState(
    JSON.parse(sessionStorage.getItem('timelines'))
  );

  const [traffic, setTraffic] = React.useState(false);

  const [mapType, setMapType] = React.useState('roadmap');

  const [stop, setStop] = React.useState(false);
  const [response, setResponse] = React.useState(null);
  const directionsCallback = (res) => {
    if (res !== null && stop === false) {
      // console.log(res);
      // console.log(stop);
      if (res.status === 'OK') {
        setResponse((prevRes) => {
          if (prevRes !== res) {
            return res;
          }
        });
        setStop(true);
      } else {
        console.log('response: ', res);
      }
    }
  };

  let originRef;
  let destRef;
  const [origin, setOrigin] = React.useState('');
  const [destination, setDestination] = React.useState('');
  const buildRoute = () => {
    if (
      originRef.value !== '' &&
      destRef.value !== '' &&
      (originRef.value !== origin || destRef.value !== destination)
    ) {
      setOrigin((prevOrigin) => {
        if (prevOrigin !== originRef.value) {
          return originRef.value;
        }
        return prevOrigin;
      });
      setDestination((prevDest) => {
        if (prevDest !== destRef.value) {
          return destRef.value;
        }
        return prevDest;
      });
      setTimelines((prevTimelines) => {
        return [
          ...prevTimelines,
          { origin: originRef.value, destination: destRef.value }
        ];
      });
      pushTimelineToDatastore(originRef.value, destRef.value);
      setStop(false);
    }
  };

  const pushTimelineToDatastore = (origin, destination) => {
    const id = JSON.parse(sessionStorage.getItem('user')).id;
    const url =
      'https://backend-dot-my-maps-cc-a2.ts.r.appspot.com/addTimeline';

    fetch(`${url}?userId=${id}&origin=${origin}&destination=${destination}`, {
      method: 'POST'
    }).catch((error) => console.log('error', error));
  };

  const displayTimeline = () => {
    const content = timelines.map((elem, index) => {
      const text = `${elem.origin} - ${elem.destination}`;
      return (
        <ListItem key={index} button>
          <ListItemText
            primary={text}
            onClick={() => {
              originRef.value = timelines[index].origin;
              destRef.value = timelines[index].destination;
            }}
          />
        </ListItem>
      );
    });
    return content;
  };

  const containerStyle = {
    width: '1280px',
    height: '720px'
  };
  const center = {
    lat: -37.840935,
    lng: 144.946457
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
            {`Welcome ${JSON.parse(sessionStorage.getItem('user')).firstname}`}
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
          <ListItem button onClick={() => setMapType('roadmap')}>
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
        </List>
        <Divider />
        <List>
          <ListItem button onClick={() => setTraffic(!traffic)}>
            <ListItemIcon>
              <TrafficIcon />
            </ListItemIcon>
            <ListItemText primary='Traffic' />
          </ListItem>
          <ListItem button onClick={() => setTimeline(!timelineOpen)}>
            <ListItemIcon>
              <TimelineIcon />
            </ListItemIcon>
            <ListItemText primary='Timeline' />
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
        <Container maxWidth='lg' className={classes.container}>
          <Grid container spacing={4}>
            <Grid item>
              <Input
                id='origin'
                type='text'
                placeholder='origin'
                inputRef={(ref) => (originRef = ref)}
              />
              <Input
                id='destination'
                type='text'
                placeholder='destination'
                inputRef={(ref) => (destRef = ref)}
              />
              <Button color='primary' onClick={() => buildRoute()}>
                Build route
              </Button>
            </Grid>
            <Grid item>
              <LoadScript googleMapsApiKey='AIzaSyAcYTKWnac-M9UbPIIJkiaAmcgVxTlD4k8'>
                <GoogleMap
                  mapTypeId={mapType}
                  mapContainerStyle={containerStyle}
                  center={center}
                  zoom={12}
                >
                  {traffic && <TrafficLayer />}
                  {destination !== '' && origin !== '' && (
                    <DirectionsService
                      options={{
                        destination: destination,
                        origin: origin,
                        travelMode: 'DRIVING'
                      }}
                      callback={directionsCallback}
                    />
                  )}
                  {response !== null && (
                    <DirectionsRenderer options={{ directions: response }} />
                  )}
                </GoogleMap>
              </LoadScript>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}
