import React, { useState, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
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

const EditProfile = () => {
  const classes = useStyles();
  const user = useSelector((state) => state.Auth.user);
  const dispatch = useDispatch();

  const [avatarFile, setAvatarFile] = useState(user.avatar);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const data = new FormData(event.target);
      const userForm = {
        id: user.id,
        avatar: avatarFile,
        username: data.get('username'),
        email: data.get('email'),
        password: data.get('password')
      };
      APIUser.editUser(userForm).then((res) => {
        if (res.status === 200) {
          APIUser.retrieveUser({
            email: data.get('email'),
            password: data.get('password')
          }).then((r) => {
            if (r.status === 200) {
              r.json().then((re) => {
                dispatch(AuthActions.setUser(re));
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
    <Container maxWidth='xs'>
      <div className={classes.paper}>
        <Typography component='h1' variant='h5'>
          Modifier les informations
        </Typography>
        <form onSubmit={handleSubmit} className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                defaultValue={user.username}
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
                defaultValue={user.email}
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
            Enregistrer les modifications
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default EditProfile;
