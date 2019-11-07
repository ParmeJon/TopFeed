const dotenv = require('dotenv').config();
const express = require("express");
const app = express();
const oauthRouter = require('./routes/oauth');
const axios = require('axios');
const http = require("http");
const querystring = require('querystring');
const appId = process.env.APP_ID
const appSecret = process.env.APP_SECRET
const mainAddress = process.env.MAIN_ADDRESS

app.use(express.json());
app.use(oauthRouter);

app.get("/", (req, res) => {
  res.sendFile(__dirname + '/index.html');
  // res.send("Hello World!!"); // test message
});

app.get("/auth", (req, res) => {
  const redirectUri = mainAddress + '/auth/callback'
  const encodedRedirectUri = encodeURIComponent(redirectUri)
  const authURI = `https://api.instagram.com/oauth/authorize?app_id=${appId}&redirect_uri=${encodedRedirectUri}&scope=user_profile,user_media&response_type=code`
  res.redirect(authURI)
})

app.get("/auth/callback", (req, res) => {
  let { code } = req.query
  const redirectUri = mainAddress + "/auth/callback";
  // IG DOCUMENTATION
  // https://socialsizzle.herokuapp.com/auth/?code=AQDp3TtBQQ...#_

  // Note that #_ has been appended to the end of the redirect URI, but it is not 
  // part of the code itself. Copy the code (without the #_ portion) so you can use 
  // it in the next step.
  
  if (code) {
    // #_ seems to not be taken into account
    // code = code.substring(0, code.length -2)
    const accessTokenPayload = {
      app_id: appId,
      app_secret: appSecret,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
      code
    }

    // ONLY ACCEPTS x-www-form-urlencoded
    axios.post("https://api.instagram.com/oauth/access_token", querystring.stringify(accessTokenPayload))
      .then((res) => {
        res.status(200).send(res)
        // axios.get(
        //   `https://graph.instagram.com/${user_id}?fields=id,username&access_token=${access_token}`
        // ) 
        //   .then((res) => res.send(res))
        //   .catch((e) => {
        //     res.status(400).send({err: 'GET USER INFO FAIL', access_token: access_token, user_id: user_id, test: "testing"})
        //   })
      })
      .catch((e) => {
        res.status(400).send(e)
      })
  } else {
    res.status(400).send("Missing parameters.")
  }
})



const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});