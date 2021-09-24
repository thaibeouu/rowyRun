export const dependencies = {
  "twitter-lite": "^1.1.0",
};
const sendgridEmail = async (data) => {
  // const { msg } = data;
  const utilFns = require("../utils");
  const twApiKey = await utilFns.getSecret("twitter_api_key");
  const twApiSecret = await utilFns.getSecret("twitter_api_secret");
  const Twitter = require("twitter-lite");
  const client = new Twitter({
    consumer_key: twApiKey,
    consumer_secret: twApiSecret,
  });

  const res = await client
    .getRequestToken("https://firetable.thaivu.work/twitter/callback")
  console.log(res);
  return res;
};
export default sendgridEmail;


