var mongoose = require('mongoose');

const CONNECTION_STRING = process.env.DB;


var issueSchema = mongoose.Schema({
    project_name: String,
    issue_title: String,
    issue_text: String,
    created_by: String,
    assigned_to: String,
    status_text: String,
    created_on: Date,
    updated_on: Date,
    open: Boolean
})
var Issue = mongoose.model('Issue', issueSchema);

mongoose.connect(CONNECTION_STRING, {useNewUrlParser: true});

module.exports = Issue;
