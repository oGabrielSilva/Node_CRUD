const express = require('express');
const route = express.Router();
const home = require('../controllers/home');
const { loginRequired } = require('../middleware/');

route.get('/', home.index);		//rota da home
route.get('/form', home.form);
route.get('/find', home.find);
route.get('/find/:id=:value', home.find);
route.get('/delete/:id=:value', home.delete);
route.get('/update/:id=:value', home.updateGet);
route.post('/update/:id=:value', home.update);
route.post('/post', home.post);

module.exports = route;
