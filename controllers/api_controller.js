const express = require('express');
const router = new express.Router();
const Scores = require("../models/scores.js");
const User = require("../models/user.js");

router.get('/dashboard', (req, res) => {
  res.status(200).json({});
});

//save a new score to the user
router.post("/save/:id", (req, res) => {
    var newScore = new Scores(req.body);
    newScore.save(function(error, doc) {
        if (error) {
            console.log("save new score error: ", error);
        } else {
            User.findOneAndUpdate({ "_id": req.params.id}, { $push: {"scores": doc._id }}, { new: true })
            .exec(function(error, doc) {
                if (error) {
                    console.log("update scores to user error: ", error);
                } else {
                    res.send(doc);
                }
            });
        }
    });
})
//get user scores
router.get("saved/:id", (req, res) => {
    Scores.findOne({ "_id": req.params.id })
    .populate("scores")
    .exec(function(error, doc) {
        if (error) {
            console.log("get user scores error: ", error);
        } else {
            res.json(doc);
        }
    })
});

//get top 5 scores
router.get("/scores", (req, res) => {
    Scores.find({})
    .limit(5)
    .sort({ scores: 1 }) 
    .exec(function(error, doc) {
        if (error) {
            console.log("top 5 error: ", error);
        } else {
            res.json(doc);
        }
    })
    
})

module.exports = router;
