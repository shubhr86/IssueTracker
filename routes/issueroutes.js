const express = require('express');
const router = express.Router();
const issueController = require('../Controllers/issueController');

// issueroutes.js
router.get('/:projectId/issues', issueController.getProjectIssues);

// Route to display the Create Issue form
router.get('/create/:projectId', issueController.showCreateIssueForm);

// Route to handle the Create Issue form submission
router.post('/create/:projectId', issueController.createIssue);

module.exports = router;
