// get router express
const express = require('express');
const router = express.Router();

router.use('/', (req, res, next) => {
    res.status(404).render('pages/notfound', {
        layout: 'layouts/main',
        title: '404 Not Found!'
    })
})

module.exports = router;