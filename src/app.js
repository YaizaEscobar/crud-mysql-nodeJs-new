const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mysql = require('mysql');
const myConnection = require('express-myconnection');
const app = express();

// Importa el archivo de rutas
const customerRoutes = require('./routes/customer');

// configurar express
//configurar el puerto
app.set('port', process.env.PORT || 3000);

//configurar donde van a estar las vistas de la app
//utilizamos ejs como motor de las vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//configurar los middlewares
app.use(morgan('dev'));
app.use(myConnection(mysql, {
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'instrumentos'
}, 'single'));

// desde el modulo de express se requiere un metodo para que codifique los campos del form
app.use(express.urlencoded({ extended: false }));

// routas
app.use('/', customerRoutes);

// archivos static files
app.use('/uploads', express.static(path.join(__dirname, 'src/public/uploads')));


// empezando el servidor
app.listen(app.get('port'), () => {
    console.log('Server on port 3000');
});
