const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// init express
const app = express();

// miscellaneous
const BASE_URL = `http://localhost:${process.env.PORT || 8080}`;

// variable
const carRoutes = require('./routes/api');
const viewRoutes = require('./routes/view');
const page404 = require('./routes/notfound');

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});


// root route
app.use('/api/car', carRoutes);
app.use('/', viewRoutes);
app.use(page404); // 404 page not found

// listen app
app.listen(
    process.env.PORT || 8080,
    process.env.HOSTNAME || 'localhost',
    (req, res) => {
        console.log(`Server running ${BASE_URL}`);
    }
);