const Issue = require('../models/issue');
const Project = require('../models/project');

// Create a new issue
exports.createIssue = async (req, res) => {
    try {
        const { title, description, labels, author } = req.body;
        const newIssue = new Issue({
            title,
            description,
            labels: labels.split(','), // Split multiple labels
            author,
            projectId: req.params.projectId,
        });
        await newIssue.save();
        res.redirect(`/projects/${req.params.projectId}`);
    } catch (error) {
        console.error('Error creating issue:', error);
        res.status(500).send('Server Error');
    }
};

// Function to render the Create Issue form
exports.showCreateIssueForm = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).send('Project not found');
        }
        res.render('create-issue', { project });
    } catch (error) {
        console.error('Error loading Create Issue form:', error);
        res.status(500).send('Server Error');
    }
};

// Get issues for a project with filtering and searching
exports.getProjectIssues = async (req, res) => {
    const projectId = req.params.projectId; // Get project ID from parameters
    const { labels, author, search } = req.query; // Get filter parameters from query

    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).send('Project not found');
        }

        // Build filter object for issues
        const filter = { projectId };

        if (labels) {
            filter.labels = { $in: labels.split(',').map(label => label.trim()) }; // Split and trim labels
        }
        if (author) {
            filter.author = { $regex: author, $options: 'i' }; // Case-insensitive search
        }
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            filter.$or = [
                { title: { $regex: searchRegex } },
                { description: { $regex: searchRegex } }
            ];
        }

        // Fetch filtered issues
        const issues = await Issue.find(filter);

        // Render the project details page with the project and filtered issues
        res.render('project-details', { project, issues });
    } catch (error) {
        console.error('Error fetching project issues:', error);
        res.status(500).send('Server Error');
    }
};
