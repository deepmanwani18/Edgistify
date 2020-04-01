const router = require("express").Router();

// Load Post model
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// Load ImageUpload and authValidator
const ensureAuth = require('../utils/ensureAuth');
const {uploadImage} = require('../config/fileUpload');

router.get('/', (req, res) => {
    Post.find().sort({_id:-1})
    .then(docs => {
        res.send(docs);
    })
    .catch(err => console.log(err));
});

router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
    .then(docs => {
        res.send(docs);
    })
    .catch(err => console.log(err));
});

router.get('/comments/:id', (req,res) => {
    Comment.find({parent: req.params.id}).sort({_id: -1})
    .then(docs => res.send(docs))
    .catch(err => console.log(err));
});

router.post('/', ensureAuth, uploadImage.single('image'), (req, res) => {
    const newPost = new Post({
        caption: req.body.caption,
        author: req.user._id,
        authorName: req.user.fname + " " + req.user.lname
    });

    console.log(req.file);

    if(req.file) {
        newPost.img = req.file.filename;
    }

    newPost.save()
    .then(post => res.json(post))
    .catch(err => console.log(err));
});

router.post('/comment', ensureAuth, (req, res) => {
    console.log(req.body);
    Post.findById(req.body.post)
    .then(post => {
        if(!post) {
            return res.status(400).send(req.body);
        }

        const newComment = new Comment({
            caption: req.body.caption,
            author: req.user._id,
            authorName: req.user.fname + " " + req.user.lname,
            parent: req.body.post,
        });
    
        return newComment.save()
        .then(comment => res.json(comment))
    })
    .catch(err => console.log(err));
});

router.post('/like', ensureAuth, (req,res) => {
    console.log(req.body);
    Post.findOneAndUpdate({_id: req.body.post, likers: { $not: {$all: [req.user._id]}}}, {$inc: {likes: 1}, $push: {likers: req.user._id}}, {new:true})
    .then(post => {
        if(!post) {
            return res.status(400).send(req.body);
        } else {
            return res.send(post);
        }
    })
    .catch(err => console.log(err));
})

module.exports = router;