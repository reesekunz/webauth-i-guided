const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const db = require("./database/dbConfig.js");
const Users = require("./users/users-model.js");

const bcrypt = require("bcryptjs");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get("/", (req, res) => {
  res.send("It's alive!");
});

server.post("/api/register", (req, res) => {
  let user = req.body;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.post("/api/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user) {
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.get("/api/users", (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.get("hash", (request, response) => {
  // const name = request.query.name;
  const credentials = request.query;
  // hash the name
  // const hash = bcrypt.hashSync(name); // use bcryptjs to hash the name
  const hash = bcrypt.hashSync(credentials.name);
  credentials.name = hash;

  response.send(`the hash for ${name} is ${hash}`);
});

const port = process.env.PORT || 5500;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));
