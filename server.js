// Config environment variables
require('dotenv').config({ path: '.env' });

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authService = require('./server/services/auth');
const app = express();
const port = 3001;

const allowedOrigins = "http://localhost:3000,https://mayank151c.github.io";

app.use(cors({
  credentials: true,
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);  // Allow the request
    } else {
      callback(new Error("Not allowed by CORS")); // Block the request
    }
  }
}));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
    if(process.env.DEBUG) {
      const start = Date.now();
      const originalResJson = res.json;
      res.json = (data) => {
        const duration = Date.now() - start;
        console.log('\n_______________________')
        console.log('\nResponse Body:', JSON.stringify(data, null, 2));
        console.log(`\n${req.method} : ${req.originalUrl} (${duration}ms)`);
        return originalResJson.call(res, data);
      }
    }
    next();
})

/*********************
 * Unprotected routes
 *********************/ 
app.post('/api/signup', async (req, res) => {
  try {
    const result = await authService.signUp(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const result = await authService.signIn(req.body);
    res.cookie("token", result.token, { 
      // 'httpOnly': This ensures, cookie is only accessible via HTTP(S) requests 
      // and not through JavaScript (helps mitigate XSS attacks).
      httpOnly: true, 
      
      // 'secure': This ensures, cookie is only sent over HTTPS, which helps protect
      // the cookie during transmission (important for preventing MITM attacks).
      secure: true,
      
      // 'sameSite': "None" is required when sending cookies cross-origin (from frontend 
      // to backend on different domains). Without this, cookies may be blocked by modern browsers.
      sameSite: "None", 
    
      // 'maxAge': This sets the expiration time for the cookie in milliseconds. 
      // In this case, the token will expire in 1 hour (3600000ms).
      maxAge: 3600000
    });
    res.status(200).json(result.message);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

/************************************
 * Middleware for token verification
 ************************************/
app.use(async (req, res, next) => {
  // get cookies
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const user = await authService.validateToken(token);
    req.user = user;
    next();
  } catch (err) {
    console.error('\nError verifying token:', err);
    res.status(401).json({ error: 'Unauthorized' });
  }
});

/*******************
 * Protected routes
 *******************/
// Check user authenticity
app.get('/api/auth', async (req, res) => res.status(200).json({ isAuthenticated: true }));

// Get user profile
app.get('/api/profile', async (req, res) => {
  try {
    const userData = await authService.getUser(req.user.id);
    res.status(200).json(userData);
  } catch (err) {
    console.error('\nError checking authentication:', err);
    res.status(404).json({ error: err.message, isAuthenticated: false });
  }
});

// Update user profile
app.put('/api/profile', async (req, res) => {
  try {
    const userData = await authService.updateUser(req.user.id, req.body);
    res.status(200).json(userData);
  } catch (err) {
    console.error('\nError checking authentication:', err);
    res.status(404).json({ error: err.message, isAuthenticated: false });
  }
});

app.use('/api/tasks', require('./server/routes/taskRouter'));
app.use('/api/events', require('./server/routes/eventRoutes'));

// Start the server
app.listen(port, () => {
  console.clear();
  console.log(`Server is running on port ${port}`);
});