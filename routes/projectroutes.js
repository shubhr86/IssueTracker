const express = require('express');
const router = express.Router();
const projectController = require('../Controllers/projectController');

router.get('/', projectController.getAllProjects);

// Route to get the create project page
router.get('/create', (req, res) => {
    res.render('create-project');
});

// Route to create a new project
router.post('/create', projectController.createProject);

// Route to get project details
router.get('/:id', projectController.getProjectDetails);

module.exports = router;
