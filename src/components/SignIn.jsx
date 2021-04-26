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
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function SignIn() {
  const classes = useStyles();
  const history = useHistory();

  const retrieveTimelines = (user) => {
    const id = JSON.parse(user).id;
    const url =
      'https://backend-dot-my-maps-cc-a2.ts.r.appspot.com/getTimeline';

    fetch(`${url}?userId=${id}`, { method: 'GET' }).then((res) => {
      if (res.status === 200) {
        res.text().then((timelines) => {
          sessionStorage.setItem('timelines', timelines);
        });
      }
    });
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
            retrieveTimelines(user);
            history.push('/maps');
          });
        }
      })
      .catch((error) => console.log('error', error));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    retrieveUser(data);
  };

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component='h1' variant='h5'>
          Sign in
        </Typography>
        <form onSubmit={handleSubmit} className={classes.form} noValidate>
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email Address'
            name='email'
            autoComplete='email'
            autoFocus
          />
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            id='password'
            autoComplete='current-password'
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <Link href='/signUp' variant='body2'>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
