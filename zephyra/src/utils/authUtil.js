export const fetchUserToken = async () => {
  try {
    console.log(process.env.REACT_APP_AUTH0_CLIENT_ID);
    console.log(process.env.REACT_APP_AUTH0_CLIENT_SECRET);

    const response = await fetch(
      "https://dev-u3pvqte1l7ripqyb.us.auth0.com/oauth/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
          client_secret: process.env.REACT_APP_AUTH0_CLIENT_SECRET,
          audience: "https://dev-u3pvqte1l7ripqyb.us.auth0.com/api/v2/",
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch access token");
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log(error.message);
  }
};
const userDetailsByIdUrl = `https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/users/`;

export const fetchMetaData = async (userToken, sub) => {
  const metadataResponse = await fetch(userDetailsByIdUrl + sub, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });
  const metadata = await metadataResponse.json();
  return metadata;
};
