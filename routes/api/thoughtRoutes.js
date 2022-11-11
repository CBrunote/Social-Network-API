const router = require('express').Router();

const {
    getAllThoughts,
    getOneThought,
    createThought,
    deleteThought,
    updateThought,
    addReaction,
    deleteReaction
} = require('../../controllers/thoughtController')

router.route('/').get(getAllThoughts).post(createThought)

router.route('/:thoughtId').get(getOneThought).put(updateThought).delete(deleteThought)

router.route('/:thoughtId/reaction').post(addReaction)

router.route('/:thoughtId/reaction/:reactionId').delete(deleteReaction)


module.exports = router