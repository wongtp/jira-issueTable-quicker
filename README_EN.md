<h1 align="center">jira-issueTable-quicker</h1>
<p align="center">This is a browser plug-in that helps us quickly edit questions on the question form page</p>
<p align="center">
  <a rel="noreferrer noopener" href="#"><img alt="Chrome Web Store" src="https://img.shields.io/badge/Chrome-141e24.svg?&style=for-the-badge&logo=google-chrome&logoColor=white&color=blue">
  </a> 
  <a rel="noreferrer noopener" href="#"><img alt="Edge Addons" src="https://img.shields.io/badge/Edge-141e24.svg?&style=for-the-badge&logo=microsoft-edge&logoColor=white&color=blue">
  </a>  
</p>

# Features
[jira](https://www.atlassian.com/software/jira) is a tool that can help effectively improve work efficiency, but when we use jira, using the issue form allows us to see more content without paying attention to details. However, currently the issue form page cannot be edited quickly, based on This question, with this plug-in, the sample function is as follows:

Original table content.
![原始的表格](assets/originIssueTable.png)

After using the plug-in, double-click the summary field to turn it into an input box, and you can modify the summary directly.
![使用插件后的表格](assets/doubleClickSummary.png)


# How to use？
 1. Enter the browser extension management page;
 2. Open browser developer options;
 3. Load the unzipped extension;
 4. Select src directory.


# Implemented
 - ✅ Double-click to edit most pure input input box fields;
 - ✅ Double-click to edit most drop-down selection box fields;
 - ✅ Double-click to edit the assignee field;
 - ✅ Double-click to edit the radio type field;
 - ⬜️ Double-click other types of fields to edit;

 # Known issues
 - ⚠️After some fields are double-clicked to enter the editable state, the value does not actually support modification. For example, the user selects a multiuserpicker type field;
 - ⚠️After some fields are double-clicked to enter the editable state, they cannot be restored to the uneditable state without modifying the value;
 - ⚠️Since the editing form data is loaded simultaneously when the table is double-clicked, if the network speed is relatively slow, it may take a long time to enter the editable state. Consider adding preloading or caching in the future;
