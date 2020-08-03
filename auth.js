const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const app = express();
const posts = [
  {
    username: "Edward",
    title: "Post 1",
  },
  {
    username: "Barry",
    title: "Post 2",
  },
];

app.use(express.json());

let refreshTokenS = [];
app.post("/token", (req, res) => {
  const refreshTkn = req.body.token;
  refreshTokenS.push(refreshTokenS);

  if (refreshTkn === null) {
    return res.send(401);
  }

  if (!refreshTokenS.includes(refreshTkn)) {
    return res.send(403);
  }

  jwt.verify(refreshTkn, process.env.REFRESH_TOKEN, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    const accessToken = generateAccessToken({ name: user.name });

    res.json({ accessToken: accessToken });
  });
});

app.delete("/logout", (req, res) => {
  refreshTokenS = refreshTokenS.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});
app.post("/login", (req, res) => {
  //authenticate

  const { username } = req.body;

  const user = {
    name: username,
  };

  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN);
  refreshTokenS.push(refreshToken);
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: "30s" });
}

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
