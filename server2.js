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
app.get("/posts", authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.name));
});

app.post("/login", (req, res) => {
  //authenticate

  const { username } = req.body;

  const user = {
    name: username,
  };

  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN);

  res.json({ accessToken: accessToken });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log(authHeader);
  console.log(token);

  if (token === null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    console.log(user);
    if (err) {
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
}

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
