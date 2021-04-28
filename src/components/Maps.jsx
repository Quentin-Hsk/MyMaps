import React, { useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid, Input, Button } from '@material-ui/core';
import {
  GoogleMap,
  LoadScript,
  TrafficLayer,
  DirectionsRenderer,
  DirectionsService
} from '@react-google-maps/api';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import APITimeline from '../api/timelinesApi';

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
  menuButton: {
    marginRight: 36
  },
  menuButtonHidden: {
    display: 'none'
  },
  title: {
    flexGrow: 1
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

const Maps = (props) => {
  const { mapType, traffic, setTimelines, histoOrigin, histoDest } = props;
  const user = useSelector((state) => state.Auth.user);
  const classes = useStyles();

  const [stop, setStop] = useState(true);
  const [response, setResponse] = useState(null);

  const directionsCallback = useCallback(
    (res) => {
      if (res !== null && stop === false) {
        if (res.status === 'OK') {
          setResponse((prevRes) => {
            if (prevRes !== res) {
              return res;
            }
            return prevRes;
          });
          setStop(true);
        }
      }
    },
    [stop]
  );

  let originRef;
  let destRef;
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const containerStyle = {
    width: '1280px',
    height: '720px'
  };
  const center = {
    lat: 45.75,
    lng: 4.85
  };

  useEffect(() => {
    if (histoOrigin !== '' && histoDest !== '') {
      originRef.value = histoOrigin;
      destRef.value = histoDest;
    }
  }, [histoOrigin, histoDest]);

  const buildRoute = () => {
    if (originRef.value !== origin || destRef.value !== destination) {
      setOrigin(originRef.value);
      setDestination(destRef.value);
      setTimelines((prevTimelines) => [
        { origin: originRef.value, destination: destRef.value },
        ...prevTimelines
      ]);
      setStop(false);
    }
  };

  const saveTimeline = useCallback(() => {
    const body = {
      userId: user.id,
      origin,
      destination,
      time: response.routes[0].legs[0].duration.value
    };
    APITimeline.addTimeline(body).then(() => {});
  }, [user, response]);

  return (
    <Container maxWidth='lg' className={classes.container}>
      <Grid container spacing={4}>
        <Grid item>
          <Input
            id='origin'
            type='text'
            placeholder='Départ'
            inputRef={(ref) => {
              originRef = ref;
            }}
          />
          <Input
            style={{ marginLeft: '10px' }}
            id='destination'
            type='text'
            placeholder='Destination'
            inputRef={(ref) => {
              destRef = ref;
            }}
          />
          <Button color='primary' onClick={() => buildRoute()}>
            Afficher le trajet
          </Button>
          <Button color='primary' variant='contained' onClick={saveTimeline}>
            Enregistrer le trajet
          </Button>
        </Grid>
        <Grid item>
          <LoadScript googleMapsApiKey='AIzaSyB8xET6_KLN-V_uBfqLI9jd-HnWsP7NyAI'>
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
                    destination,
                    origin,
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
  );
};

Maps.propTypes = {
  mapType: PropTypes.string.isRequired,
  traffic: PropTypes.bool.isRequired,
  setTimelines: PropTypes.func.isRequired,
  histoOrigin: PropTypes.string,
  histoDest: PropTypes.string
};

Maps.defaultProps = {
  histoOrigin: '',
  histoDest: ''
};

export default Maps;
