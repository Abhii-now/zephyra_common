import { store } from "app/store";

const customFetch = async (url, options = {}, user = false) => {
  const state = store.getState();
  // console.log(state.auth.userToken);
  // console.log("access " + state.auth.accessToken);
  const token = user ? state.auth.userToken : state.auth.accessToken;
  // if (user) console.log(token);
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  const updatedOptions = {
    ...options,
    headers,
  };

  return fetch(url, updatedOptions);
};

export default customFetch;
