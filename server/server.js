import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import session from 'express-session';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import connectMongoDBSession from 'connect-mongodb-session';
const MongoDBStore = connectMongoDBSession(session);
import User from './models/User.js';

dotenv.config();
const app = express();

// MongoDBStore connection
const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'mySessions',
    autoRemove: 'native'
});
store.on('error', function(error) {
    console.error('Session store error:', error);
});
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}
));

const PORT = process.env.PORT_NUM || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'mySecretKey',
    store: store,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));
// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

// Middleware to check authentication
function checkAuth(req, res, next) {
    if (req.session.user && req.session.isAuthenticated) {
        next();
        
    } else {
        return res.status(401).json({ message: 'Access denied' });
    }
}
// Middleware to check roles
const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (req.session.user && allowedRoles.includes(req.session.user.role)) {
            next();
        } else {
            return res.status(403).json({ message: 'Forbidden' });
        }
    };
};

// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    req.session.isAuthenticated = true;
    req.session.user = { id: user._id, role: user.role };
    res.json({ message: 'Logged In' });
});

// Register Route
app.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    let user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
        username,
        email,
        password: hashedPassword,
        role
    });
    await newUser.save();
    req.session.personal = newUser.username;
    req.session.isAuthenticated = true;
    req.session.user = { username: newUser.username, role: newUser.role };
    res.json({ message: 'Registered successfully' });
});

// Route to check user role
app.get('/getUserRole', checkAuth, (req, res) => {
    res.json({ role: req.session.user.role });
});

// Protected routes based on roles
app.get('/data', checkAuth, checkRole(['manager', 'teamleader', 'user']), (req, res) => {
    res.json({ message: 'Read data' });
});

app.post('/data', checkAuth, checkRole(['manager', 'teamleader']), (req, res) => {
    res.json({ message: 'Write data' });
});

app.put('/data', checkAuth, checkRole(['manager', 'teamleader']), (req, res) => {
    res.json({ message: 'Modify data' });
});

app.delete('/data', checkAuth, checkRole(['manager']), (req, res) => {
    res.json({ message: 'Delete data' });
});

app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
});
