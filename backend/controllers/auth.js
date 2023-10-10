import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mysql from "mysql";

const db = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "Aj1Berem2Grozdje3",
    database: "baza",
  });
// User registration
export const register = (req, res) => {
  const { username, email, password } = req.body;

  const checkUserQuery = "SELECT * FROM user WHERE email = ? OR username = ?";
  db.query(checkUserQuery, [email, username], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    if (data.length) {
      return res.status(409).json({ error: "User already exists" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const insertUserQuery =
      "INSERT INTO user(`username`,`email`,`password`) VALUES (?)";
    const values = [username, email, hash];

    db.query(insertUserQuery, [values], (err, data) => {
      if (err) {
        return res.status(500).json({ error: "Registration failed" });
      }
      return res.status(200).json({ message: "User has been registered" });
    });
  });
};

// User login
export const login = (req, res) => {
  const { username, password } = req.body;

  const getUserQuery = "SELECT * FROM user WHERE username = ?";
  db.query(getUserQuery, [username], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordCorrect = bcrypt.compareSync(password, data[0].password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Wrong username or password" });
    }

    const token = jwt.sign({ id: data[0].id }, process.env.JWT_SECRET);
    const { password: _, ...userDetails } = data[0];

    res
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "none", // Change according to your needs
        secure: true, // Use secure flag in production
      })
      .status(200)
      .json(userDetails);
  });
};

// User logout
export const logout = (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    sameSite: "none", // Change according to your needs
    secure: true, // Use secure flag in production
  }).status(200).json({ message: "User has been logged out" });
};
