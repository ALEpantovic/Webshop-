import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mysql from "mysql";
import cookieParser from "cookie-parser";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors());
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions))
const db = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "Aj1Berem2Grozdje3",
  database: "baza",
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

app.post("/backend/upload", upload.single("file"), function (req, res) {
  const file = req.file;
  res.status(200).json(file.filename);
});

function isAdmin(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('JWT Verification Error:', err);
      return res.status(403).json({ error: 'Forbidden: Invalid token.' });
    }

    const userId = decoded.id;
    console.log('Decoded User ID:', userId);

    const getUserRoleQuery = 'SELECT role FROM user WHERE id = ?';
    db.query(getUserRoleQuery, [userId], (err, result) => {
      if (err) {
        console.error('Error fetching user role:', err);
        return res.status(500).json({ error: 'Database error.' });
      }

      const userRole = result[0] ? result[0].role : '';
      console.log('User Role:', userRole);

      if (userRole !== 'administrator') {
        return res.status(403).json({ error: 'Forbidden: Insufficient privileges.' });
      }

      next();
    });
  });
}
app.delete('/test/:id', (req, res) => {
  const productId = req.params.id;
  const deleteProductQuery = 'DELETE FROM product WHERE id=?';
  db.query(deleteProductQuery, [productId], (err, result) => {
    if (err) {
      console.error('Error deleting product:', err);
      return res.status(500).json({ error: 'Failed to delete the product.' });
    }

    return res.status(200).json({ message: 'Product deleted successfully.' });
  });
});
app.post("/backend/auth/register", (req, res) => {
  const { username, email, password, ime_prezime, telefon, grad_adresa } = req.body;

  const checkUserQuery = "SELECT * FROM user WHERE email = ? OR username = ?";
  db.query(checkUserQuery, [email, username], (err, data) => {
    if (err) {
      console.error("Error checking user:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (data.length) {
      console.log("User already exists:", data);
      return res.status(409).json({ error: "User already exists" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    console.log("Hashed password:", hash);

    const insertUserQuery =
      "INSERT INTO user(`username`,`email`,`password`,`ime_prezime`,`telefon`,`grad_adresa`) VALUES (?,?,?,?,?,?)";
    const values = [username, email, hash, ime_prezime, telefon, grad_adresa];

    db.query(insertUserQuery, values, (err, data) => {
      if (err) {
        console.error("Error inserting user:", err);
        return res.status(500).json({ error: "Registration failed" });
      }
      console.log("User registered successfully:", data);
      return res.status(200).json({ message: "User has been registered" });
    });
  });
});

const { JWT_SECRET } = process.env; 

// User login
app.post("/backend/auth/login", (req, res) => {
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

    try {
      const token = jwt.sign({ id: data[0].id }, JWT_SECRET); 
      const { password: _, ...userDetails } = data[0];
    
      res
        .cookie("token", token, {
          httpOnly: false,
          sameSite: "lax", 
          secure: false,
        })
        .status(200)
        .json({token: token, ...userDetails }); 
    } catch (jwtError) {
      console.error("JWT signing error:", jwtError);
      return res.status(500).json({ error: "Error generating token" });
    }
  });
});

app.post('/api/products', (req, res) => {
  const { Naziv, Proizvodjac, Tip_kafe, Vrsta_kafe, Opis, cena } = req.body;

  const insertProductQuery = `
    INSERT INTO product(Naziv, Proizvodjac, Tip_kafe, Vrsta_kafe, Opis, cena)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    insertProductQuery,
    [Naziv, Proizvodjac, Tip_kafe, Vrsta_kafe, Opis, cena],
    (err, data) => {
      if (err) {
        console.error('Error inserting product:', err);
        return res.status(500).json({ error: 'Product creation failed' });
      }
      console.log('Product created successfully:', data);
      return res.status(200).json({ message: 'Product has been created' });
    }
  );
});


app.get('/api/products', (req, res) => {
  const selectAllProductsQuery = 'SELECT * FROM product';

  db.query(selectAllProductsQuery, (err, data) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
    return res.status(200).json(data);
  });
});

app.get('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  const selectProductQuery = 'SELECT * FROM product WHERE id = ?';

  db.query(selectProductQuery, [productId], (err, data) => {
    if (err) {
      console.error('Error fetching product:', err);
      return res.status(500).json({ error: 'Failed to fetch product' });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.status(200).json(data[0]);
  });
});

app.post('/api/admin/products', (req, res) => {
  const { Naziv, Proizvodjac, Tip_Kafe, Vrsta_Kafe, Opis, cena, Slike } = req.body;


  if (!Naziv || !Proizvodjac || !Tip_Kafe || !Vrsta_Kafe || !Opis || !cena || !Slike) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const insertProductQuery = 'INSERT INTO product (Naziv, Proizvodjac, Tip_Kafe, Vrsta_Kafe, Opis, cena, Slike) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(insertProductQuery, [Naziv, Proizvodjac, Tip_Kafe, Vrsta_Kafe, Opis, cena, Slike], (err, result) => {
    if (err) {
      console.error('Error inserting product:', err);
      return res.status(500).json({ error: 'Failed to create the product.' });
    }

    return res.status(201).json({ message: 'Product created successfully.' });
  });
});

app.put('/api/admin/products/:id', (req, res) => {
  const productId = req.params.id;
  const { Naziv, Proizvodjac, Tip_kafe, Vrsta_kafe, Opis, cena } = req.body;
  console.log('Received update request with data:', req.body);


  if (!Naziv || !Proizvodjac || !Tip_kafe || !Vrsta_kafe || !Opis || !cena) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const updateProductQuery = 'UPDATE product SET Naziv=?, Proizvodjac=?, Tip_Kafe=?, Vrsta_Kafe=?, Opis=?, cena=? WHERE id=?';
  db.query(updateProductQuery, [Naziv, Proizvodjac, Tip_kafe, Vrsta_kafe, Opis, cena, productId], (err, result) => {
    if (err) {
      console.error('Error updating product:', err);
      return res.status(500).json({ error: 'Failed to update the product.' });
    }

    return res.status(200).json({ message: 'Product updated successfully.' });
  });
});

app.post("/backend/auth/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: false,
    sameSite: "lax",
    secure: false,
  }).status(200).json({ message: "User has been logged out" });
});


app.get("/test", (req, res) => {
  const q = "SELECT * FROM product";
  db.query(q, (err, data) => {
    if (err) return res.json("nema podataka");
    return res.json(data);
  });
});
app.get("/test/da", (req, res) => {
  const q = "SELECT * FROM user";
  db.query(q, (err, data) => {
    if (err) return res.json("nema podataka");
    return res.json(data);
  });
});

app.get('/backend/get-role', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  console.log(token);
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden: Invalid token.' });
    }
    const userId = decoded.id;
    const getUserRoleQuery = 'SELECT role FROM user WHERE id = ?';
    db.query(getUserRoleQuery, [userId], (err, result) => {
      if (err) {
        console.error('Error fetching user role:', err);
        return res.status(500).json({ error: 'Database error.' });
      }

      const userRole = result[0] ? result[0].role : '';
      return res.status(200).json({ userRole }); 
    });
  });
});

app.get("/test/:id", (req, res) => {
  const productId = req.params.id;
  const q = "SELECT * FROM product WHERE id = ?";
  db.query(q, [productId], (err, data) => {
    if (err) return res.json(err);
    if (data.length === 0) return res.json("proizvod nije nadjen");
    return res.json(data[0]);
  });
});

app.get("/", (req, res) => {
  res.json("bemkemmdd");
});

app.post("/test", (req, res) => {
  const q =
    "INSERT INTO product(`Naziv`,`Proizvodjac`,`Tip_kafe`,`Vrsta_kafe`,`Opis`,`cena`) VALUES (?)";
  const values = [
    req.body.Naziv,
    req.body.Proizvodjac,
    req.body.Tip_kafe,
    req.body.Vrsta_kafe,
    req.body.Opis,
    req.body.cena,
  ];
  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.listen(8800, () => {
  console.log("povezano na bekend");
});
