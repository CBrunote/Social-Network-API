const { Thought, User } = require('../models')

module.exports = {
    getAllThoughts(req, res) {
        Thought.find()
        .then((thoughts) => res.json(thoughts))
        .catch((err) => res.status(500).json(err))
    },

    getOneThought(req, res) {
        console.log(req.params)
        Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v')
        .then((thought) =>
            !thought
            ? res.status(404).json({ message: 'No thought found with that Id' })
            : res.json({thought})
        )
        .catch((err) => {
            console.log(err)
            return res.status(500).json(err)
        })
    },

    createThought(req, res) {
        Thought.create(req.body)
        .then((thought) =>
         !thought
            ? res.status(404).json({ message: 'Thought creation failed' })
            : User.findOneAndUpdate(
                {userId: req.body.userId},
                {$push: {thought: thought.thoughtText}},
                {runValidators: true, new: true},
            )
            .then((user) => 
             !user
                ? res.status(404).json({message: 'No User Found'})
                : res.json({message: 'Thought created successfully'})
            )
        )
        .then((thought) => res.json(thought))
        .catch((err) => {
            console.log(err)
            return res.status(500).json(err)
        })
    },

    deleteThought(req, res) {
        Thought.findOneAndDelete({ thoughtId: req.params.thoughtId })
            .then(() => res.json({ message: 'Thought deleted successfully' }))
            .catch((err) => res.status(500).json(err));
    },

    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { thoughtId: req.params.thoughtId },
            { 
                thoughtName: req.body.thoughtName,
                username: req.body.username
            },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                ? res.status(404).json({ message: 'thought not found' })
                : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

    addReaction(req, res) {
        Thought.findOneAndUpdate(
            { thoughtId: req.params.thoughtId },
            { $addToSet: {reactions: req.body}  },
            { runValidators: true, new: true }
        )
            .then((thought)=>
                !thought
                ? res.status(404).json({ message: 'Thought Not Found' })
                : res.json(thought)
            )
            .catch((err)=> res.status(500).json(err))
    },

    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            { thoughtId: req.params.thoughtId },
            { $pull: {reactions: {reactionId: req.params.reactionId}} },
            { runValidators: true, new: true }
        )
            .then((thought) => 
                !thought
                ? res.status(404).json({ message: 'Thought Not Found' })
                : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    }, 
}