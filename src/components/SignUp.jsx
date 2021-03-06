import React, { useState, useCallback } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import AuthActions from '../logic/actions/auth_actions';
import APIUser from '../api/usersApi';

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
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  }
}));

export default function SignUp() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const [avatarFile, setAvatarFile] = useState(null);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const data = new FormData(event.target);
      const user = {
        avatar: avatarFile,
        username: data.get('username'),
        email: data.get('email'),
        password: data.get('password')
      };
      APIUser.createUser(user).then((res) => {
        if (res.status === 200) {
          APIUser.retrieveUser({
            email: data.get('email'),
            password: data.get('password')
          }).then((r) => {
            if (r.status === 200) {
              r.json().then((re) => {
                dispatch(AuthActions.setUser(re));
                history.push('/dashboard');
              });
            }
          });
        }
      });
    },
    [avatarFile]
  );

  const handleFile = (event) => {
    const reader = new FileReader();

    reader.readAsDataURL(event.target.files[0]);
    reader.onload = () => {
      setAvatarFile(reader.result);
    };
  };

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Cr??er un compte
        </Typography>
        <form onSubmit={handleSubmit} className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete='username'
                name='username'
                variant='outlined'
                required
                fullWidth
                id='username'
                label="Nom d'utilisateur"
                autoFocus
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              {!avatarFile && (
                <label htmlFor='avatar'>
                  <input
                    accept='image/*'
                    id='avatar'
                    hidden
                    type='file'
                    onChange={handleFile}
                  />
                  <Button
                    startIcon={<CloudUploadIcon />}
                    variant='contained'
                    color='primary'
                    component='span'
                    size='small'
                  >
                    Choisir un avatar
                  </Button>
                </label>
              )}
              {avatarFile && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <img src={avatarFile} alt='preview' width={50} height={50} />
                  <Button
                    style={{ marginLeft: '10px' }}
                    onClick={() => setAvatarFile(null)}
                    size='small'
                    variant='outlined'
                    color='primary'
                  >
                    Supprimer
                  </Button>
                </div>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                required
                fullWidth
                id='email'
                label='Email'
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
                label='Mot de passe'
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
            Cr??er un compte
          </Button>
          <Grid container justify='flex-end'>
            <Grid item>
              <Link href='/' variant='body2'>
                D??j?? un compte ? Connectez-vous
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
