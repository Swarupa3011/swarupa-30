const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');

const router = express.Router();

// File Upload Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage });

// User Registration
router.post('/register', upload.single('resume'), async (req, res) => {
    const { username, password, fullName, email, type } = req.body;
    const resume = req.file ? req.file.path : '';

    try {
        const newUser = new User({ username, password, fullName, email, resume, type });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
    }
});

// User Login
router.post('/login', async (req, res) => {
    const { username, password, type } = req.body;

    try {
        const user = await User.findOne({ username, password, type });
        if (user) {
            res.status(200).json({ message: 'Login successful', user });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
});

// Post a Job
router.post('/jobs', async (req, res) => {
    const { title, description, salary, postedBy } = req.body;

    try {
        const newJob = new Job({ title, description, salary, postedBy });
        await newJob.save();
        res.status(201).json({ message: 'Job posted successfully', job: newJob });
    } catch (error) {
        res.status(500).json({ error: 'Error posting job' });
    }
});

// Get All Jobs
router.get('/jobs', async (req, res) => {
    try {
        const jobs = await Job.find().populate('postedBy', 'username');
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching jobs' });
    }
});

// Apply for a Job
router.post('/apply', upload.single('applicantResume'), async (req, res) => {
    const { jobId, applicantName, applicantAge, applicantGender, coverLetter } = req.body;
    const applicantResume = req.file ? req.file.path : '';

    try {
        const newApplication = new Application({
            jobId,
            applicantName,
            applicantAge,
            applicantGender,
            applicantResume,
            coverLetter,
        });
        await newApplication.save();
        res.status(201).json({ message: 'Application submitted successfully', application: newApplication });
    } catch (error) {
        res.status(500).json({ error: 'Error submitting application' });
    }
});

// Get Applications for a Job
router.get('/applications/:jobId', async (req, res) => {
    const { jobId } = req.params;

    try {
        const applications = await Application.find({ jobId });
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching applications' });
    }
});

module.exports = router;