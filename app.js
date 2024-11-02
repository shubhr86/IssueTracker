const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const projectRoutes = require('./routes/projectroutes');
const issueRoutes = require('./routes/issueroutes');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb+srv://freemovie9com:DV0AyqOqo5QmEt9b@cluster0.k6ddc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('MongoDB connection error:', error));

// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // For static files like CSS

// Route for home page to show all projects
app.get('/', require('./Controllers/projectController').getAllProjects);

// Routes for project details and creation
app.use('/projects', projectRoutes);
app.use('/issues', issueRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
