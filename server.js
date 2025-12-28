const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;
const USERS_FILE = "users.json";
const QUERIES_FILE = "queries.json";

app.use(bodyParser.json());
app.use(express.static(".")); 

// ================== FILE HELPERS ==================
function loadFile(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function saveFile(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ================== LOGIN ==================
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = loadFile(USERS_FILE);

  const user = users.find(
    u =>
      u.username.toLowerCase() === username.toLowerCase() &&
      u.password === password
  );

  if (user) {
    res.json({ success: true, role: user.role, username: user.username });
  } else {
    res.json({ success: false });
  }
});

// ================== REGISTER ==================
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  let users = loadFile(USERS_FILE);

  if (users.find(u => u.username === username)) {
    return res.json({ success: false, message: "User already exists" });
  }

  users.push({ username, password, role: "student" });
  saveFile(USERS_FILE, users);

  res.json({ success: true });
});

// ================== CONTACT ==================
app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;
  let queries = loadFile(QUERIES_FILE);

  const newQuery = {
    id: Date.now(),
    name,
    email,
    message,
    date: new Date().toISOString()
  };

  queries.push(newQuery);
  saveFile(QUERIES_FILE, queries);

  res.json({ success: true, message: "Query submitted successfully!" });
});

// ================== ADMIN: VIEW USERS ==================
app.get("/users", (req, res) => {
  const users = loadFile(USERS_FILE);
  res.json(users);
});

// ================== ADMIN: DELETE USER ==================
app.delete("/users/:username", (req, res) => {
  let users = loadFile(USERS_FILE);
  const { username } = req.params;

  users = users.filter(
    u => u.username.toLowerCase() !== username.toLowerCase()
  );

  saveFile(USERS_FILE, users);
  res.json({ success: true, message: "User deleted" });
});

// ================== ADMIN: VIEW QUERIES ==================
app.get("/queries", (req, res) => {
  const queries = loadFile(QUERIES_FILE);
  res.json(queries);
});

// ================== ADMIN: DELETE QUERY ==================
app.delete("/queries/:id", (req, res) => {
  let queries = loadFile(QUERIES_FILE);
  const { id } = req.params;

  queries = queries.filter(q => q.id != id);
  saveFile(QUERIES_FILE, queries);

  res.json({ success: true, message: "Query deleted" });
});

// =====================================================
// 🔥 SKILL PROGRESSION & CAREER READINESS API (NEW)
// =====================================================
app.post("/skill-roadmap", (req, res) => {
  const { career, skills } = req.body;

  const marketSkills = {
    "Frontend Developer": ["html", "css", "javascript", "react", "git", "projects"],
    "Data Analyst": ["excel", "sql", "python", "statistics", "power bi"],
    "Software Engineer": ["dsa", "java", "oops", "sql", "system design"]
  };

  const required = marketSkills[career] || [];
  const missing = required.filter(skill => !skills.includes(skill));

  const readiness = required.length === 0
    ? 0
    : Math.round(((required.length - missing.length) / required.length) * 100);

  res.json({
    career,
    required,
    missing,
    readiness
  });
});

// ================== SERVER START ==================
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
