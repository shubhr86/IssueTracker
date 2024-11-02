const Project = require('../models/project');
const Issue = require('../models/issue'); // Ensure you import the Issue model

// Get all projects with pagination
exports.getAllProjects = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Current page number from query parameter, default is 1
    const limit = 12; // Number of projects per page
    const skip = (page - 1) * limit; // Calculate how many projects to skip

    try {
        const totalProjects = await Project.countDocuments(); // Count total number of projects
        const totalPages = Math.ceil(totalProjects / limit); // Calculate total pages based on total projects

        const projects = await Project.find()
            .skip(skip) // Skip the calculated number of documents
            .limit(limit) // Limit the number of documents returned
            .exec();

        res.render('home', {
            projects,
            totalPages,
            currentPage: page // Send the current page to the template for pagination
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).send('Server Error');
    }
};

// Create a new project
exports.createProject = async (req, res) => {
    try {
        const { name, description, author } = req.body;
        const newProject = new Project({ name, description, author });
        await newProject.save();
        res.redirect('/'); // Ensure it redirects correctly to the projects page
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).send('Server Error');
    }
};

// Get project details
exports.getProjectDetails = async (req, res) => {
    try {
        const projectId = req.params.id;
        console.log('Project ID:', projectId); // Log to see the ID being passed
        const project = await Project.findById(projectId);
        if (!project) return res.status(404).send('Project not found');
        
        // Find issues related to the project
        const issues = await Issue.find({ projectId: projectId });

        res.render('project-details', { project, issues });
    } catch (error) {
        console.error('Error fetching project details:', error);
        res.status(500).send('Server Error');
    }
};
