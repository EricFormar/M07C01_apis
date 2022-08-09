require('dotenv').config();
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const app = express();

const morgan = require('morgan');

app.use(morgan('dev'))


//URL encode  - Para que nos pueda llegar la información desde el formulario al req.body
app.use(express.json())
app.use(express.urlencoded({ extended: false }));



//Ejecuto el llamado a mis rutas
const indexRouter = require('./routes/index');
const moviesRoutes = require('./routes/moviesRoutes');
const genresRoutes = require('./routes/genresRoutes');

//Aquí pueden colocar las rutas de las APIs
app.use('/api/genres',require('./routes/api/genresRoutes'))
app.use('/api/movies',require('./routes/api/moviesRoutes'))

// view engine setup
app.set('views', path.resolve(__dirname, './views'));
app.set('view engine', 'ejs');

app.use(express.static(path.resolve(__dirname, '../public')));

//Aquí estoy disponiendo la posibilidad para utilizar el seteo en los formularios para el usod e los metodos put ó delete
app.use(methodOverride('_method'));

//rutas
app.use('/', indexRouter);
app.use(moviesRoutes);
app.use(genresRoutes);


//manejo de errores
app.use((req,res,next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error)
})

app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
        status : error.status,
        message : error.message
    })
})


//Activando el servidor desde express
app.listen('3001', () => console.log('Servidor corriendo en el puerto 3001'));
