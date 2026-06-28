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
const { stripTypeScriptTypes } = require('module');

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

//==================================
//             ACCOUNT
//==================================

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
                hp: user.hp,
                energy: user.energy,
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

        const userId = newUser.rows[0].id;

        const seedSkillsQuery = `INSERT INTO user_skills (user_id, skill_key, current_level, current_exp)
        VALUES
            ($1, 'sleep', 1, 0),
            ($1, 'food', 1, 0),
            ($1, 'cooking', 1, 0),
            ($1, 'fitness',1, 0)`;
        await pool.query(seedSkillsQuery, [userId]);

        res.json({message: "Registration successful! Life skills initialized.", user: newUser.rows[0]});
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

//==================================
//             SKILLS
//==================================

app.get('/api/user/:userId/skills', async (req, res) => {
    const {userId} = req.params;

    try{
        const skillsResult = await pool.query(
            'SELECT id, skill_key, name, skill_description, current_level, current_exp FROM user_skills WHERE user_id = $1', [userId]
        );

        if (skillsResult.rows.length === 0){
            return res.json({ sleep: 1, food: 1, cooking: 1, fitness: 1});
        }

        const formattedSkills = skillsResult.rows.map(row => {
            const readableName = row.skill_key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
            return{
                id: row.id, // Used for React keys
                skill_key: row.skill_key,
                name: readableName,
                description: row.skill_description,
                current_level: row.current_level,
                current_exp: row.current_exp
            }
           
        });

        res.json(formattedSkills);
    } catch (err){
        console.error(err.message);
        res.status(500).json({error: "Server error retrieving user skills."});
    }
})

app.post('/api/user/:userId/skills', async (req,res) =>{
    const {userId} = req.params;
    const {name, skill_key, description} = req.body;

    if(!name || !skill_key){
        return res.status(400).json({ error: "Skill not found."});
    }

    try{
        const skillCheck = await pool.query(
            'SELECT id FROM user_skills WHERE user_id = $1 AND skill_key = $2', [userId, skill_key]
        );

        if(skillCheck.rows.length > 0){
            return res.status(400).json({ error: "This skill already exists."});
        }

        const newSkillResult = await pool.query(
            `INSERT INTO user_skills (user_id, skill_key, name, skill_description, current_level, current_exp)
            VALUES ( $1, $2, $3, $4, 1, 0)
            RETURNING id, skill_key, name, skill_description, current_level, current_exp`, [userId, skill_key, name , description || 'Custom life skill']
        );

        const savedRow = newSkillResult.rows[0];

        res.status(201).json({
            id: savedRow.id,
            skill_key: savedRow.skill_key,
            name: savedRow.name,
            description: savedRow.skill_description,
            current_level: savedRow.current_level,
            current_exp: savedRow.current_exp
        });
    } catch (err) {
        console.error("Error forging new custom skill:", err.message);
        res.status(500).json({ error: "Failed to add skill."});
    }

})

app.delete('/api/skills/:skillId', async (req, res) => {
    const { skillId } = req.params;

    try {
        // 1. Ensure we aren't letting someone accidentally delete core masteries
        const coreSkills = ['sleep', 'food', 'cooking', 'fitness'];
        
        const checkSkill = await pool.query(
            'SELECT skill_key FROM user_skills WHERE id = $1',
            [skillId]
        );

        if (checkSkill.rows.length === 0) {
            return res.status(404).json({ error: "This skill discipline does not exist in the archives." });
        }

        if (coreSkills.includes(checkSkill.rows[0].skill_key)) {
            return res.status(400).json({ error: "Core rules cannot be struck from your active ledger." });
        }

        // 2. Perform the erasure execution
        await pool.query('DELETE FROM user_skills WHERE id = $1', [skillId]);

        res.status(200).json({ success: true, message: "Skill successfully forgotten." });
    } catch (err) {
        console.error("Error erasing skill record:", err.message);
        res.status(500).json({ error: "The guild ledger failed to execute the erasure sequence." });
    }
});

//==================================
//             QUESTS
//==================================

app.get('/api/user/:userId/quests', async (req, res) => {
    const { userId } = req.params;
    try{
        const result = await pool.query('SELECT * FROM user_quests WHERE user_id = $1 ORDER BY id DESC', [userId]);
        res.json(result.rows);
    } catch (err){
        console.error("Error fetching quests:", err.message);
        res.status(500).json({error: "Server error retrieving quests."});
    }
});

app.post('/api/user/:userId/quests', async (req, res) => {
    const { userId } = req.params;
    const { title, difficulty, skill_target} = req.body;

    if (!title || !skill_target){
        return res.status(400).json({error: "Title and target skill are required fields."});
    }

    try{
        const newQuest = await pool.query(
            `INSERT INTO user_quests (user_id, title, difficulty, skill_target)
            VALUES ($1, $2, $3, $4)
            RETURNING *`, [userId, title, difficulty || 'Bronze', skill_target]
        );
        res.json({message: "Quest added succesffully!", quest: newQuest.rows[0]});
    } catch (err){
        console.error("Error creating quest:", err.message);
        res.status(500).json({error: "Server error creating new quest."});
    }
})

app.put('/api/quests/:questId', async (req,res) => {
    const { questId } = req.params;
    const { title, difficulty, skill_target } = req.body;
    try{
        const updated = await pool.query(
            `UPDATE user_quests SET title = $1, difficulty = $2, skill_target = $3 WHERE id = $4 RETURNING *`, [title, difficulty, skill_target, questId]
        );
        res.json({ message: "Quest updated!", quest: updated.rows[0]});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error updating quest."});
    }
})

app.delete('/api/quests/:questId', async (req, res) => {
    const { questId } = req.params;
    try{
        await pool.query('DELETE FROM user_quests WHERE id = $1', [questId]);
        res.json({ message: "Quest successfully removed."});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error deleting quest."});
    }
})

app.post('/api/quests/:questId/complete', async (req, res) => {
    const { questId } = req.params;
    try{
        //Get quest
        const questResult = await pool.query('SELECT * FROM user_quests WHERE id = $1', [questId]);
        if (questResult.rows.length === 0) {
            return res.status(404).json({ error: "Quest not found."});
        }
        const quest = questResult.rows[0];
        const userId = quest.user_id;
        const skillKey = quest.skill_target;

        //The amount of EXP, Skill EXP and coins each difficulty gives (can change any time)
        let userXpGained = 15;
        let skillXpGained = 25;
        let coinsGained = 5;

        if (quest.difficulty === 'Project'){
            userXpGained = 30;
            skillXpGained = 45;
            coinsGained = 15;
        } else if (quest.difficulty === 'Special'){
            userXpGained = 50;
            skillXpGained = 60;
            coinsGained = 30;
        }

        //Current user data
        const userResult = await pool.query('SELECT level, exp, coins FROM users WHERE id = $1', [userId]);
        let user = userResult.rows[0];

        let newUserXp = user.exp + userXpGained;
        let newLevel = user.level;
        let newCoins = (user.coins || 0) + coinsGained;

        //User level up checks and calculations
        let userXpNeeded = Math.floor(100 * Math.pow(newLevel, 2.2));
        while (newUserXp >= userXpNeeded){
            newUserXp -= userXpNeeded;
            newLevel += 1;
            userXpNeeded = Math.floor(100 * Math.pow(newLevel, 2.2));
        }

        //Current Skill data
        const skillResult = await pool.query(
            'SELECT current_level, current_exp FROM user_skills WHERE user_id = $1 AND skill_key = $2', [userId, skillKey]
        );

        let newSkillXp = skillXpGained;
        let newSkillLevel = 1;

        if(skillResult.rows.length > 0){
            newSkillXp += skillResult.rows[0].current_exp;
            newSkillLevel = skillResult.rows[0].current_level;
        }

        //Skill level up checks and calculations
        let skillXpNeeded = Math.floor(150 * Math.pow(newSkillLevel, 2.15));
        while (newSkillXp >= skillXpNeeded){
            newSkillXp -= skillXpNeeded;
            newSkillLevel += 1;
            skillXpNeeded = Math.floor(150 * Math.pow(newSkillLevel, 2.15));
        }

        await pool.query('BEGIN');

        const updatedUser = await pool.query(
            `UPDATE users SET level = $1, exp = $2, coins = $3 WHERE id = $4
            RETURNING id, user_name, level, exp, coins, hp, energy, avatar_url`, [newLevel, newUserXp, newCoins, userId]
        );

        await pool.query(
            `INSERT INTO user_skills (user_id, skill_key, current_level, current_exp) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id, skill_key)
            DO UPDATE SET current_level = $3, current_exp = $4`, [userId, skillKey, newSkillLevel, newSkillXp]
        )

        await pool.query('DELETE FROM user_quests WHERE id = $1', [questId]);
        await pool.query('COMMIT');

        res.json({
            message: "Quest Completed! Rewards claimed.",
            gained: { userXp: userXpGained, skillXp: skillXpGained, coins: coinsGained},
            user: updatedUser.rows[0]
        });
    } catch (err){
        await pool.query('ROLLBACK');
        console.error("Error completing quest:". err.message);
        res.status(500).json({error: "Server error executing completion transaction logic"});
    }
});

app.listen(5000, () => {
    console.log('Backend server is officially running on port 5000');
})
