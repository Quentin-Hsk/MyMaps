import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function SignUp() {
  const classes = useStyles();
  const history = useHistory();

  const createUser = (data) => {
    const url = 'https://backend-dot-my-maps-cc-a2.ts.r.appspot.com/signup';

    fetch(
      `${url}?firstname=${data.get('firstname')}&lastname=${data.get(
        'lastname'
      )}&email=${data.get('email')}&password=${data.get('password')}`,
      { method: 'POST' }
    )
      .then((response) => {
        if (response.status === 200) {
          retrieveUser(data);
        }
      })
      .catch((error) => console.log('error', error));
  };

  const retrieveUser = (data) => {
    const url = 'https://backend-dot-my-maps-cc-a2.ts.r.appspot.com/login';

    fetch(
      `${url}?email=${data.get('email')}&password=${data.get('password')}`,
      { method: 'GET' }
    )
      .then((res) => {
        if (res.status === 200) {
          res.text().then((user) => {
            sessionStorage.setItem('user', user);
            sessionStorage.setItem('timelines', '[]');
            history.push('/maps');
          });
        }
      })
      .catch((error) => console.log('error', error));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    createUser(data);
  };

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component='h1' variant='h5'>
          Sign up
        </Typography>
        <form onSubmit={handleSubmit} className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete='fname'
                name='firstName'
                variant='outlined'
                required
                fullWidth
                id='firstName'
                label='First Name'
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant='outlined'
                required
                fullWidth
                id='lastName'
                label='Last Name'
                name='lastName'
                autoComplete='lname'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                required
                fullWidth
                id='email'
                label='Email Address'
                name='email'
                autoComplete='email'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                required
                fullWidth
                name='password'
                label='Password'
                type='password'
                id='password'
                autoComplete='current-password'
              />
            </Grid>
          </Grid>
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify='flex-end'>
            <Grid item>
              <Link href='/' variant='body2'>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
