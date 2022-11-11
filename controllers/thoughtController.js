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
                {username: req.body.username},
                {$push: {thoughts: thought._id}},
                {runValidators: true, new: true},
            )
            .then((username) => 
             !username
                ? res.status(404).json({message: 'No User Found'})
                : res.json({message: 'Thought created successfully'})
            )
        )
        .catch((err) => {
            console.log(err)
            return res.status(500).json(err)
        })
    },

    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
            .then(() => {
                User.findOneAndUpdate({thoughts: req.params.thoughtId},
                    {$pull: { thoughts: req.params.thoughtId}},
                    { new: true}
                    )
                    .then(() => res.json({ message: 'Thought deleted successfully' }))
                    .catch((err) => res.status(500).json(err));
            }
                    )
            .catch((err) => res.status(500).json(err));
    },

    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
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
            { _id: req.params.thoughtId },
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
            { _id: req.params.thoughtId },
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