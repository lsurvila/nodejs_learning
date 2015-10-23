// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function () {

    // Populate the user table on initial page load
    populateTable();

});

var userListElement = $('#userList');
// Username link click
userListElement.find('table tbody').on('click', 'td a.linkshowuser', showUserInfo);
// Delete User link click
userListElement.find('table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

// Add User button click
$('#btnAddUser').on('click', addUser);

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON('/users/userlist', function (data) {
        userListData = data;
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function () {
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList').find('table tbody').html(tableContent);
    });
}

// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function (arrayItem) {
        return arrayItem.username;
    }).indexOf(thisUserName);

    // Get out User Object
    var thisUserObject = userListData[arrayPosition];

    // Populate Info Box
    $('#userInfoName').text(' ' + thisUserObject.fullname);
    $('#userInfoAge').text(' ' + thisUserObject.age);
    $('#userInfoGender').text(' ' + thisUserObject.gender);
    $('#userInfoLocation').text(' ' + thisUserObject.location);
}

// Add User
function addUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    var addUserElement = $('#addUser');
    addUserElement.find('input').each(function () {
        if ($(this).val() === '') {
            errorCount++;
        }
    });

    // Check and make sure errorCount's still at zero
    if (errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'username': addUserElement.find('fieldset input#inputUserName').val(),
            'email': addUserElement.find('fieldset input#inputUserEmail').val(),
            'fullname': addUserElement.find('fieldset input#inputUserFullname').val(),
            'age': addUserElement.find('fieldset input#inputUserAge').val(),
            'location': addUserElement.find('fieldset input#inputUserLocation').val(),
            'gender': addUserElement.find('fieldset input#inputUserGender').val()
        };

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function (response) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                addUserElement.find('fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
}

// Delete User
function deleteUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function (response) {

            // Check for a successful (blank response)
            if (response.msg === '') {

            } else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();
        })
    } else {
        // If they said no to the confirm, do nothing
        return false;
    }
}
