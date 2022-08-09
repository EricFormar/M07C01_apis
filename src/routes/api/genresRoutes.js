const express = require('express');
const router = express.Router();
const {list,detail,create, update} = require('../../controllers/api/genresController');

router
    .get('/', list)
    .get('/:id', detail)
    .post('/',create)
    .put('/:id',update)


module.exports = router;