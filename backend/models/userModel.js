const db = require("../config/db");

const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      }
    );
  });
};

const createUser = (user) => {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO users (username, email, password, address) VALUES (?, ?, ?, ?)",
      [user.username, user.email, user.password, user.address],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

const findUserById = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT id, username, email, address FROM users WHERE id = ?",
      [id],
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      }
    );
  });
};

module.exports = {
  findUserByEmail,
  createUser,
  findUserById,
};