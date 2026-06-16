//Initialize Backend
//Express for backend
//pg for database
//bcrypt for hashing passwords
//cors for data transfer
//multer for image files

const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json())
app.use(cors());

//Connect to the database
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'liferpg_db',
    password: 'postgresql',
    port: 5432
})

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `avatar-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({storage: storage});

app.get('/', (req,res) => {
    res.send('The Life RPG Server is up and running!');
});

//Login
app.post('/api/login', async (req,res) => {
    const {user_name, password} = req.body;

    try {
        const userResult = await pool.query('SELECT * FROM users WHERE user_name = $1', [user_name])

        if (userResult.rows.length === 0){
            return res.status(400).json({error: "Invalid user name or password."});
        }

        const user = userResult.rows[0];

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid){
            return res.status(400).json({error: "Invalid user name or password."});
        }

        res.json({
            message: "Logged in successfully!",
            user: {
                id: user.id, 
                user_name: user.user_name,
                level: user.level,
                exp: user.exp,
                avatar_url: user.avatar_url
            }
        });
    } catch (err){
        console.error(err.message);
        res.status(500).json({error: "Server error during login."});
    }
})

//Register
app.post('/api/register', async (req,res) => {
    const {user_name , password } = req.body;

    try {
        //Hash the password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        
        //Add the user into the database
        const newUser = await pool.query(
            'INSERT INTO users (user_name, password_hash) VALUES ($1, $2) RETURNING id, user_name', [user_name, passwordHash]
        );

        res.json({message: "Registration successful!", user: newUser.rows[0]});
    } catch (err){
        console.error(err.message);
        res.status(500).json({error: "User might already exist or server error."})
    }
});

app.post('/api/user/upload-avatar', upload.single('avatar'), async (req, res) => {
    try{
        const { userId } = req.body;
        if (!req.file) {
            return res.status(400).json({ error: "No image file provided."});
        }

        const userResult = await pool.query('SELECT avatar_url FROM users WHERE id = $1', [userId]);
        if (userResult.rows.length > 0){
            const oldAvatarPath = userResult.rows[0].avatar_url;

            if (oldAvatarPath){
                const absoluteOldPath = path.join(__dirname, oldAvatarPath);

                if (fs.existsSync(absoluteOldPath)){
                    fs.unlinkSync(absoluteOldPath);
                    console.log(`Successfully deleted: ${oldAvatarPath}`);
                }
            }
        }
        const avatarPath = `/uploads/${req.file.filename}`;
        await pool.query(
            'UPDATE users SET avatar_url = $1 WHERE id = $2',
            [avatarPath, userId]
        );

        res.json({message: "Avatar uploaded successfully!", avatarPath});
    } catch (err){
        console.error(err.message);
        res.status(500).json({error: "Server error during avatar saving."});
    }
});

app.listen(5000, () => {
    console.log('Backend server is officially running on port 5000');
})
