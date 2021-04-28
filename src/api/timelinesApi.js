const getTimelines = async (userId) => {
  const url = 'https://api-dot-my-maps-311817.ey.r.appspot.com/getTimelines';

  return fetch(`${url}?userId=${userId}`, {
    method: 'GET'
  }).then((res) => res);
};

const addTimeline = async (data) => {
  const url = 'https://api-dot-my-maps-311817.ey.r.appspot.com/addTimeline';

  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then((res) => res);
};

const APITimeline = {
  getTimelines,
  addTimeline
};
export default APITimeline;
