var express = require('express');
var router = express.Router();

/* GET userlist. */
router.get('/userlist', function (req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    collection.find({}, {}, function (e, docs) {
        res.json(docs);
    });
});

/* POST to adduser. */
router.post('/adduser', function (req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    collection.insert(req.body, function (err) {
        res.send((err === null) ? {msg: ''} : {msg: err});
    });
});

/* DELETE to deleteuser. */
router.delete('/deleteuser/:id', function (req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    var userToDelete = req.params.id;
    collection.remove({'_id': userToDelete}, function (err) {
        res.send((err === null) ? {msg: ''} : {msg: err});
    });
});

/* UPDATE to updateuser */
router.put('/updateuser', function (req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    collection.find({_id: req.body.id}, {}, function(err, docs) {
        if (req.hasOwnProperty('username')) {
            docs.username = req.username;
        }
        if (req.hasOwnProperty('email')) {
            docs.email = req.email;
        }
        if (req.hasOwnProperty('fullname')) {
            docs.fullname = req.fullname;
        }
        if (req.hasOwnProperty('age')) {
            docs.age = req.age;
        }
        if (req.hasOwnProperty('location')) {
            docs.location = req.location;
        }
        if (req.hasOwnProperty('gender')) {
            docs.gender = req.gender;
        }
        res.send((err === null) ? {msg: ''} : {msg: err});
        //collection.update({_id: req.body._id}, docs, function (err) {
        //    res.send((err === null) ? {msg: ''} : {msg: err});
        //});
    });

});

module.exports = router;
