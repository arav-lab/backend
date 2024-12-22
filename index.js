const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize Express app
const app = express();
app.use(express.json());

const corsOptions = {
    origin: "https://frontend-video-rho.vercel.app/", // Replace with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  };
app.use(cors(corsOptions));

// MongoDB connection string
const MONGO_URI = 'mongodb+srv://arav727598:gtWaud5po6Q55K1d@cluster0.zpoow.mongodb.net/';

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error(err));

// Define User schema and model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:{type:String,required:true},
  password:{type:String,required:true},
  videosWatched: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
});

const User = mongoose.model('User', userSchema);

// Routes

// Create a new user
app.post('/users/register', async (req, res) => {
  const { username,email,password } = req.body;
  try {
    const user = new User({username,email,password});
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/user/login',async (req,res)=>{
    const {email} = req.body;
    try {
        const useremail = await User.findOne({email});
        if (!useremail){
            res.status(404).json('User is not Find');
        }
        res.status(200).json(useremail);
    } catch (error) {
        
    }
})

// Get user profile by ID
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update user points when they watch a video
app.post('/users/video/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.videosWatched += 1;
    user.points = user.videosWatched * 5;
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/', (req,res)=>{
    res.status(200).send('Server is Runing');
})

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
