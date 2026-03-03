const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt=require("bcryptjs")

const app = express();
const PORT = 4000;
const SECRET_KEY = process.env.SECRET_KEY || "event_secret_key";

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Root",
  database: "event_management_system",
});

con.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected!");
});

// JWT Middleware
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Invalid authorization format" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    // Ensure required fields exist
    if (!decoded.id || !decoded.role) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    req.user = decoded; // attach user info
    next();

  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}


/* ================= ADMIN CHECK ================= */

function isAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.role.toLowerCase() !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }

  next();
}

// REGISTER
app.post("/register", async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  // Basic Validation
  if (!name || !email || !password || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Only allow user or vendor from frontend
  const allowedRoles = ["user", "vendor"];
  const userRole = allowedRoles.includes(role) ? role : "user";

  const checkQuery = "SELECT * FROM users WHERE email = ?";

  con.query(checkQuery, [email], async (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (result.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const insertQuery =
        "INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)";

      con.query(
        insertQuery,
        [name, email, phone, hashedPassword, userRole],
        (err) => {
          if (err)
            return res.status(500).json({ message: "Database error" });

          res.status(201).json({
            message: `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} registered successfully`,
          });
        }
      );
    } catch (error) {
      return res.status(500).json({ message: "Error hashing password" });
    }
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query = "SELECT * FROM users WHERE email = ?";

  con.query(query, [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = results[0];

    try {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
          email: user.email,
        },
        SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.json({
        message: "Login successful",
        token,
        role: user.role,
        name: user.name,
      });

    } catch (error) {
      return res.status(500).json({ message: "Login failed" });
    }
  });
});
  
// ADD MEMBERSHIP (Admin Only)
app.post("/add-membership", verifyToken, isAdmin, (req, res) => {
  const {
    fullName,
    email,
    phone,
    age,
    duration,
    amount
  } = req.body;

  /* ================= VALIDATION ================= */

  if (!fullName || !email || !phone || !age || !duration || !amount) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!["6months", "1year", "2years"].includes(duration)) {
    return res.status(400).json({ message: "Invalid duration selected" });
  }

  if (parseInt(age) < 18) {
    return res.status(400).json({ message: "Minimum age is 18" });
  }

  if (parseFloat(amount) <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  /*  MEMBERSHIP NUMBER  */

  const membershipNumber = "MEM" + Date.now();

  const startDate = new Date();
  const endDate = new Date(startDate);

  /*  DURATION LOGIC  */

  if (duration === "6months") {
    endDate.setMonth(endDate.getMonth() + 6);
  } else if (duration === "1year") {
    endDate.setFullYear(endDate.getFullYear() + 1);
  } else if (duration === "2years") {
    endDate.setFullYear(endDate.getFullYear() + 2);
  }

  /* ================= INSERT MEMBERSHIP ================= */

  const insertQuery = `
    INSERT INTO memberships 
    (membership_number, full_name, email, phone, age, duration, amount, start_date, end_date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
  `;

  con.query(
    insertQuery,
    [
      membershipNumber,
      fullName,
      email,
      phone,
      age,
      duration,
      amount,
      startDate,
      endDate
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
      }

      const membershipId = result.insertId;

      /* ================= CREATE TRANSACTION ================= */

      const transactionQuery = `
        INSERT INTO transactions 
        (membership_id, membership_number, transaction_type, amount)
        VALUES (?, ?, 'new', ?)
      `;

      con.query(
        transactionQuery,
        [membershipId, membershipNumber, amount],
        (err) => {
          if (err) console.error("Transaction Error:", err);
        }
      );

      /* ================= CREATE REPORT ================= */

      const reportQuery = `
        INSERT INTO reports 
        (membership_number, report_type, description)
        VALUES (?, 'New Membership', ?)
      `;

      con.query(
        reportQuery,
        [
          membershipNumber,
          `New membership created for ${fullName} (${duration})`
        ],
        (err) => {
          if (err) console.error("Report Error:", err);
        }
      );

      /* ================= RESPONSE ================= */

      res.json({
        message: "Membership added successfully",
        membershipNumber,
        startDate,
        endDate
      });
    }
  );
});

// GET MEMBERSHIP BY NUMBER (For Update Screen)
app.get("/membership/:membership_number", verifyToken, (req, res) => {
  const { membership_number } = req.params;

  con.query(
    "SELECT * FROM memberships WHERE membership_number = ?",
    [membership_number],
    (err, results) => {
      if (err) return res.status(500).json({ msg: "Database error" });

      if (results.length === 0)
        return res.status(404).json({ msg: "Membership not found" });

      res.json(results[0]);
    }
  );
});

// UPDATE MEMBERSHIP (Admin Only)
app.put("/update-membership", verifyToken, isAdmin, (req, res) => {
  const { membership_number, action } = req.body;

  con.query(
    "SELECT * FROM memberships WHERE membership_number = ?",
    [membership_number],
    (err, results) => {
      if (err || results.length === 0)
        return res.status(400).json({ message: "Membership not found" });

      const member = results[0];

      if (action === "extend") {
        const newEndDate = new Date(member.end_date);
        newEndDate.setMonth(newEndDate.getMonth() + 6);

        con.query(
          "UPDATE memberships SET end_date = ? WHERE membership_number = ?",
          [newEndDate, membership_number]
        );

        con.query(
          `INSERT INTO transactions 
           (membership_id, membership_number, transaction_type, amount)
           VALUES (?, ?, 'extend', ?)`,
          [member.id, membership_number, member.amount]
        );

        con.query(
          `INSERT INTO reports 
           (membership_number, report_type, description)
           VALUES (?, 'Extension', ?)`,
          [
            membership_number,
            `Membership extended for ${member.full_name}`
          ]
        );
      }

      if (action === "cancel") {
        con.query(
          "UPDATE memberships SET status = 'cancelled' WHERE membership_number = ?",
          [membership_number]
        );

        con.query(
          `INSERT INTO transactions 
           (membership_id, membership_number, transaction_type, amount)
           VALUES (?, ?, 'cancel', 0)`,
          [member.id, membership_number]
        );

        con.query(
          `INSERT INTO reports 
           (membership_number, report_type, description)
           VALUES (?, 'Cancellation', ?)`,
          [
            membership_number,
            `Membership cancelled for ${member.full_name}`
          ]
        );
      }

      res.json({ message: "Membership updated successfully" });
    }
  );
});


// TRANSACTIONS (Admin + User)
app.get("/transactions", verifyToken, (req, res) => {
  con.query(
    "SELECT * FROM transactions ORDER BY transaction_date DESC",
    (err, result) => {
      if (err) {
        console.error("TRANSACTIONS ERROR:", err);   
        return res.status(500).json({ message: "Error fetching transactions" });
      }
      res.json(result);
    }
  );
});


// REPORTS (Admin + User)
app.get("/reports", verifyToken, (req, res) => {
  console.log("USER FROM TOKEN:", req.user);

  con.query("SELECT * FROM reports ORDER BY created_at DESC", (err, result) => {
    if (err) return res.status(500).json({ message: "Error fetching reports" });
    res.json(result);
  });
});

// ADD SERVICE (VENDOR ONLY)
app.post("/vendor/add-service", verifyToken, (req, res) => {
  if (req.user.role !== "vendor") {
    return res.status(403).json({ message: "Access denied" });
  }

  const { service_name, category, description, price } = req.body;

  if (!service_name || !price) {
    return res.status(400).json({ message: "Service name and price are required" });
  }

  const query = `
    INSERT INTO vendor_services 
    (vendor_id, service_name, category, description, price)
    VALUES (?, ?, ?, ?, ?)
  `;

  con.query(
    query,
    [req.user.id, service_name, category, description, price],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
      }

      res.status(201).json({ message: "Service added successfully" });
    }
  );
});

// GET SERVICES (VENDOR ONLY)
app.get("/vendor/my-services", verifyToken, (req, res) => {
  if (req.user.role !== "vendor") {
    return res.status(403).json({ message: "Access denied" });
  }

  const query = `
    SELECT * FROM vendor_services 
    WHERE vendor_id = ?
    ORDER BY created_at DESC
  `;

  con.query(query, [req.user.id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    res.json(results);
  });
});

// UPDATE SERVICE (VENDOR ONLY)
app.put("/vendor/update-service/:id", verifyToken, (req, res) => {
  if (req.user.role !== "vendor") {
    return res.status(403).json({ message: "Access denied" });
  }

  const serviceId = req.params.id;
  const { service_name, category, description, price } = req.body;

  const query = `
    UPDATE vendor_services
    SET service_name = ?, category = ?, description = ?, price = ?
    WHERE id = ? AND vendor_id = ?
  `;

  con.query(
    query,
    [service_name, category, description, price, serviceId, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Service not found" });
      }

      res.json({ message: "Service updated successfully" });
    }
  );
});

// DELETE SERVICE (VENDOR ONLY)
app.delete("/vendor/delete-service/:id", verifyToken, (req, res) => {
  if (req.user.role !== "vendor") {
    return res.status(403).json({ message: "Access denied" });
  }

  const serviceId = req.params.id;

  const query = `
    DELETE FROM vendor_services
    WHERE id = ? AND vendor_id = ?
  `;

  con.query(query, [serviceId, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json({ message: "Service deleted successfully" });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
