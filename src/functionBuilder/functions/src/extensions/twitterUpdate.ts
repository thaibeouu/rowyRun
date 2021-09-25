export const dependencies = {
  "twitter-api-v2": "^1.5.2",
};
const twitterUpdate = async (data, context) => {
  console.log(data, context);
  const TwitterApi = require("twitter-api-v2");
  const { db } = require("../firebaseConfig");

  db.collection("twitter_auth")
    .doc("megadragonzx@gmail.com")
    .get()
    .then((res) => {
      const client = new TwitterApi({
        appKey: res.get("api_key"),
        appSecret: res.get("api_secret"),
        accessToken: res.get("oauth_token"),
        accessSecret: res.get("oauth_token_secret"),
      });
      client
        .login(res.get("oauth_verifier"))
        .then(({ client: loggedClient }) => {
          loggedClient.v1.tweet("Test tweet.");
        })
        .catch(() =>
          res.status(403).send("Invalid verifier or access tokens!")
        );
    });

  return true;
};
export default twitterUpdate;
