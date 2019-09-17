// middleware to check for username and password
// if credentials are valid, let request continue, if invalid, return 401
// use the middleware to restrict access to the GET endpoint /users
// const bcrypt = require("bcryptjs");

// const Users = require("../users/users-model.js");

module.exports = (req, res, next) => {
  // let { username, password } = req.headers;

  // Users.findBy({ username })
  //   .first()
  //   .then(user => {
  //     if (user && bcrypt.compareSync(password, user.password)) {
  //       next();
  //     } else {
  //       res.status(401).json({ message: "You cannot pass!" });
  //     }
  //   })
  //   .catch(error => {
  //     res.status(500).json(error);
  //   });
  // from Day 1



  // from Day 2
  // Is the user logged in? Do we have information about the user in our session?
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ message: "You shall not pass!" });
  }
  // middleware doesnt need to verify credentials anymore, just needs to check in to see if the user has a session
};




// how you would access the headers with axios

// function fetch() {
//   const reqOptions = {
//     headers: {
//       username: '',
//       password: '',
//     },
//   };

// axios.get(url, reqOptions).then().catch()
// axios.post(url, data, reqOptions).then().catch()
