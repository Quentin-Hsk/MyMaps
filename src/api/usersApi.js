const retrieveUser = async (data) => {
  const url = 'https://api-dot-my-maps-311817.ey.r.appspot.com/login';

  return fetch(`${url}?email=${data.email}&password=${data.password}`, {
    method: 'GET'
  }).then((res) => res);
};

const editUser = async (data) => {
  const url = 'https://api-dot-my-maps-311817.ey.r.appspot.com/editProfil';

  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then((res) => res);
};

const createUser = async (data) => {
  const url = 'https://api-dot-my-maps-311817.ey.r.appspot.com/signup';

  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then((res) => res);
};

const APIUser = {
  retrieveUser,
  createUser,
  editUser
};
export default APIUser;
