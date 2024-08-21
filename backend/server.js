const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://prasu202324:prasu202324@cluster0.vvzre.mongodb.net/');

const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  phoneNo: String,
  currentHostelBlock: String,
  currentFloor: String,
  desiredHostelBlock: String,
  desiredFloor: String,
});

const User = mongoose.model('User', userSchema);

app.post('/submit', async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const newUser = new User(req.body);
    await newUser.save();
    res.send('User details saved');
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/users', async (req, res) => {
  const { desiredFloor, desiredHostelBlock } = req.query;
  const filter = {};

  if (desiredFloor) {
    const floorRegex = new RegExp(desiredFloor.replace(/\s+/g, '').split('').join('\\s*'), 'i');
    filter.currentFloor = { $regex: floorRegex };
  }

  if (desiredHostelBlock) {
    const blockRegex = new RegExp(desiredHostelBlock.replace(/\s+/g, '').split('').join('\\s*'), 'i');
    filter.currentHostelBlock = { $regex: blockRegex };
  }

  try {
    const users = await User.find(filter);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
