const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const db = require("./database/dbConfig.js");
const Users = require("./users/users-model.js");

const bcrypt = require("bcryptjs");
const restrictedUserValidation = require("./auth/restricted-middleware.js");
// day 2 - adding session (npm install express-session)
const session = require("express-session");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

const sessionConfig = {
  // cookie name being sent to the browser, it would name the cookie sid by default if no name
  name: "chocolateChip",
  // want to encrypt with secret
  secret: process.env.SESSION_SECRET || "keep it secret, keep it safe",
  cookie: {
    // maxAge - how long is this cookie going to be good for (in milliseconds)
    maxAge: 1000 * 60 * 60,
    // if http connection is not secure, dont send (true means only send cookie over https - want it to be true in production)
    secure: false,
    // true means JS has no access to the cookie (only the browser has access)
    httpOnly: true
  },
  resave: false,
  saveUninitialized: true // GDPR compliance (pop up where a user can agree that they want to recieve cookies)
};
server.use(session(sessionConfig));

server.get("/", (req, res) => {
  res.send("It's alive!");
});

// Hashing password on POST
server.post("/api/register", (req, res) => {
  let { username, password } = req.body;
  // 8 is the number of rounds - higher the number, the more secure the hash will be (harder for someone to pregenerate a hash)
  // try to have the # at 14 or higher
  const hash = bcrypt.hashSync(password, 8);

  Users.add({ username, password: hash })
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

// Verifying passwords
server.post("/api/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      // checking password
      if (user && bcrypt.compareSync(password, user.password)) {
        // returns true or false
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        // Dont send 404 message because we dont want them to be guessing usernames
        res.status(401).json({ message: "You shall not pass!" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.get("/api/users", restrictedUserValidation, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.get("/hash", (request, response) => {
  const name = request.query.name;
  // hash the name
  const hash = bcrypt.hashSync(name, 8); // use bcryptjs to hash the name

  response.send(`the hash for ${name} is ${hash}`);
});

const port = process.env.PORT || 5600;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));

// middleware to check for username and password
// if credentials are valid, let request continue, if invalid, return 401
// use the middleware to restrict access to the GET endpoint /users
