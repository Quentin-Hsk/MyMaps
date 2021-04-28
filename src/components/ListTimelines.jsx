import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { DataGrid } from '@material-ui/data-grid';
import PropTypes from 'prop-types';
import APITimeline from '../api/timelinesApi';

const ListTimelines = (props) => {
  const { setHistoDest, setHistoOrigin, setDisplay } = props;
  const user = useSelector((state) => state.Auth.user);

  const [timelineList, setTimelineList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      APITimeline.getTimelines(user.id).then((res) => {
        if (res.status === 200) {
          res.json().then((r) => {
            setTimelineList(r);
            setLoading(false);
          });
        }
      });
    }
  }, [user]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'origin', headerName: 'Départ', width: 150 },
    { field: 'destination', headerName: 'Arrivée', width: 150 },
    {
      field: 'time',
      headerName: 'Temps',
      type: 'number',
      width: 115
    },
    {
      field: 'sub',
      headerName: 'Abonné',
      width: 130
    }
  ];

  const handleClick = useCallback((params) => {
    setHistoDest(params.row.destination);
    setHistoOrigin(params.row.origin);
    setDisplay('maps');
  }, []);

  return (
    <Container maxWidth='md'>
      <Grid container spacing={2}>
        <div style={{ height: 400, width: '100%', margin: '40px' }}>
          <DataGrid
            rows={timelineList}
            columns={columns}
            checkboxSelection
            disableColumnMenu
            loading={loading}
            onCellClick={handleClick}
          />
        </div>
      </Grid>
    </Container>
  );
};

ListTimelines.propTypes = {
  setHistoOrigin: PropTypes.func.isRequired,
  setHistoDest: PropTypes.func.isRequired,
  setDisplay: PropTypes.func.isRequired
};

export default ListTimelines;
