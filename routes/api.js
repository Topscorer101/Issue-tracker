'use strict';

var expect = require('chai').expect;
const Issue = require('../models/issueModel');


module.exports = function (app) {
    //Index page (static HTML)
    app.route('/')
    .get(function (req, res) {
        res.render('../views/pug/index.pug');
    });


    //Sample front-end
    app.route('/:project/')
    .get(function (req, res) {
        let projectName = req.params.project
        // To filter the issues on the main page
        let queries = req.query;
        /* Add the project name to the queries object, so it can be included in the search */
        queries.project_name = projectName;
        /* To make sure that the true and false boolean values are used,
        rather than strings with the words 'true' and 'false' */
        if (queries.open == 'true') {
            queries.open = true;
        }
        else {
            queries.open = false
        }

        Issue.find(
          // Project to look for
          queries,
          // Callback to deal with result
          (err, result) => {
              if (err) {
                  console.error(err);
              }
            res.render(
                '../views/pug/issues.pug',
                { project: projectName, issues: result }
                    );;
          }
        );
    });


    app.route('/api/issues/:project')
    /* TODO: I can GET /api/issues/{projectname} for an array of all issues on that specific project with all the information for each issue as was returned when posted. */
    .get(function (req, res){
        var project = req.params.project;
        /* TODO: I can filter my get request by also passing along any field and value in the query(ie. /api/issues/{project}?open=false). I can pass along as many fields/values as I want. */
        let queries = req.query;
        /* Add the project name to the queries object, so it can be included in the search */
        queries.project_name = project;
        /* To make sure that the true and false boolean values are used,
        rather than strings with the words 'true' and 'false' */
        if (queries.open == 'true') {
            queries.open = true;
        }
        else {
            queries.open = false
        }

        Issue.find(
          // Project to look for
          queries,
            // Callback to deal with result
          (err, result) => {
              if (err) {
                  console.error(err);
              }
            res.json(result);
          }
        );
    })

    /* TODO: I can POST /api/issues/{projectname} with form data containing required issue_title, issue_text, created_by, and optional assigned_to and status_text. */
    .post(function (req, res){
        /* TODO: The object saved (and returned) will include all of those fields (blank for optional no input) and also include created_on(date/time), updated_on(date/time), open(boolean, true for open, false for closed), and _id. */
        let newIssue = {
            project_name: req.body.project_name,
            issue_title: req.body.issue_title,
            issue_text: req.body.issue_text,
            created_by: req.body.created_by,
            assigned_to: req.body.assigned_to,
            status_text: req.body.status_text,
            created_on: new Date(),
            updated_on: new Date(),
            open: true
        };

        // Create a new issue, and save it to the database
        Issue.create(newIssue, (err, result) => {
            if (err) console.log("Database error: " + err);
            res.json(result);
        })
    })

    /* TODO: I can PUT /api/issues/{projectname} with a _id and any fields in the object with a value to object said object. Returned will be 'successfully updated' or 'could not update '+_id. This should always update updated_on. */
    .put(function (req, res){
        // Create an object to hold all of the updated fields
        let updates = {
            // Change the updated date/time, whenever an update is made
            updated_on: new Date()
        }

        // Get the issue's ID from the form
        let issueId = req.body.update_issue_id;
// Get all the fields that were filled in
        let updatedTitle = req.body.update_issue_title;
        let updatedText = req.body.update_issue_text;
        let updatedAssignee = req.body.update_assigned_to;
        let updatedStatus = req.body.update_status_text;
        let updatedOpen = req.body.open;

        // TODO: Add only the fields with data to the new object
        if (updatedTitle) {
            updates.issue_title = updatedTitle;
        }
        if (updatedText) {
            updates.issue_text = updatedTitle;
        }
        if (updatedAssignee) {
            updates.assigned_to = updatedAssignee;
        }
        if (updatedStatus) {
            updates.status_text = updatedStatus;
        }
        if (updatedOpen) {
            updates.open = false;
        }

        // TODO: If no fields are sent, return 'no updated field sent'
        let fieldArr = [
            updatedTitle,
            updatedText,
            updatedAssignee,
            updatedStatus,
            updatedOpen
        ]
        let allEmpty = fieldArr.every(
            elem => Boolean(elem) == false
        );
        if (allEmpty) {
            res.send('no updated field sent');
            return;
        }

        // Find the issue by its ID, to update it
        Issue.findByIdAndUpdate(
            // ID to search for
             issueId,
            // Update(s) to make
            updates,
            // Callback to deal with result
            (err, issue) => {
                if (err) {
                    console.error(err);
                }
                res.send('successfully updated');
                return;
            }
        );
    })

    /* TODO: I can DELETE /api/issues/{projectname} with a _id to completely delete an issue. */
    .delete(function (req, res){
        // Get the issue's ID from the form
        let issueId = req.body.update_issue_id;
        // If no _id is sent return '_id error'.
        if (!issueId) {
            res.send('_id error');
            return;
        }

        Issue.findByIdAndRemove(
            // ID to search for
            issueId,
            // Callback to deal with result
            (err, issue) => {
                if (err) {
                    console.error(err);
                    // failed: 'could not delete '+_id.
                    res.send('could not delete ' + issueId)
                    return;
                }
                // If success: 'deleted '+_id
                res.send('deleted '+ issue._id);
                return;
            }
        );
    });
};
