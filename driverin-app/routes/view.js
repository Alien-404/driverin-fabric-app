// get router express
require('dotenv').config();
const router = require('express').Router();
const axios = require('axios');

const apiUrl = `http://localhost:${process.env.PORT || 8080}/api`;
// homepage
router.get('/', async (req, res) => {
    try {

        const cars = await axios.get(`${apiUrl}/car`);

        return res.render('pages/home', {
            title: 'Driverin | Homepage',
            layout: 'layouts/main',
            cars: cars.data.data
        })
    } catch (error) {
        console.log(error.message);
    }
})

router.get('/create', async (req, res) => {
    try {
        return res.render('pages/create', {
            title: 'Driverin | Create Car',
            layout: 'layouts/main',
        })
    } catch (error) {
        console.log(error.message);
    }
})

router.get('/:vin', async (req, res) => {

    try {
        // query data
        const { vin } = req.params;
        const car = await axios.get(`${apiUrl}/car/${vin}`);


        // render
        return res.render('pages/detail', {
            title: 'Driverin | Detail Car',
            layout: 'layouts/main',
            car: car.data.data
        })


    } catch (error) {
        return res.render('pages/notfound', {
            title: 'Driverin | 404 Not Found',
            layout: 'layouts/main'
        })
    }
})


module.exports = router;