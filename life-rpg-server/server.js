//Initialize Backend
//Express for backend
//pg for database
//bcrypt for hashing passwords
//cors for data transfer

const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const cors = require('cors');

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
            user: {id: user.id, user_name: user.user_name}
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

app.listen(5000, () => {
    console.log('Backend server is officially running on port 5000');
})
