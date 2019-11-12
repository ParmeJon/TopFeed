const dotenv = require('dotenv').config();
const path = require('path')
const express = require("express");
const app = express();
const oauthRouter = require('./routes/oauth');
const httpRequest = require("request");
const JSONbig = require('json-bigint');
const querystring = require('querystring');
const appId = process.env.APP_ID
const appSecret = process.env.APP_SECRET
const mainAddress = process.env.MAIN_ADDRESS

app.use(express.static(path.join(__dirname, './topfeed-client/build')));
app.use(oauthRouter);

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
      'app_id': appId,
      'app_secret': appSecret,
      'grant_type': "authorization_code",
      'redirect_uri': redirectUri,
      'code': code
    }
    const options = {
      url: "https://api.instagram.com/oauth/access_token",
      method: "POST",
      form: {
        app_id: appId,
        app_secret: appSecret,
        grant_type: "authorization_code",
        redirect_uri: mainAddress,
        code: code
      }
    }

      httpRequest(options, function (err, response, body) {
      if (!err && response.statusCode == 200) {
        // FOR SOME REASON JSON.parse is converting original body ID wrong.
        // This is due to the body user_id being returned as an integer
        // converting too large of a number with js causes incorrect conversion
        const { access_token, user_id } = JSONbig.parse(body);
        // res.redirect(mainAddress + '/?' + `access_token=${access_token}`)

        const userIdLink = `https://graph.instagram.com/${user_id}?fields=id,username&access_token=${access_token}`;
        const mediaLink = `https://graph.instagram.com/me/media?fields=id,caption,media_url,media_type,permalink,like_count&access_token=${access_token}`;
        const newOptions = {
          url: mediaLink
        }
        httpRequest(newOptions, function(err, response, body) {
          if (!err && response.statusCode == 200) {
            const info = JSONbig.parse(body)
            res.status(200).send(info)
          } else {
            res.status(400)
          }
        })
        } else {
          res.status(400)
        }
      })
      
    // ONLY ACCEPTS x-www-form-urlencoded ?
    // const formattedPayload = querystring.stringify(accessTokenPayload)
    // axios.post("https://api.instagram.com/oauth/access_token", formattedPayload)
    //   .then((axiosResponse) => {
    //     return res.status(200).send({response: axiosResponse, note: "RESPONSE FROM POST"})
    //     // axios.get(
    //     //   `https://graph.instagram.com/${user_id}?fields=id,username&access_token=${access_token}`
    //     // ) 
    //     //   .then((res) => res.send(res))
    //     //   .catch((e) => {
    //     //     res.status(400).send({err: 'GET USER INFO FAIL', access_token: access_token, user_id: user_id, test: "testing"})
    //     //   })
    //   }).catch((e) => {
    //     res.status(400).send({err: "POST FAIL", e})
    //   })
  } else {
    res.status(400).send("Missing parameters.")
  }
})

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/topfeed-client/build/index.html"));
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});