-- base de datos
CREATE DATABASE instrumentoslaboratorio;

-- Utilizar la base de datos
use instrumentoslaboratorio;

-- crear tabla 
CREATE TABLE productos {
    id INT(6) AUTO_INCREMENT PRIMARY KEY,
    nombreProducto VARCHAR(50) NOT NULL,
    descripcion VARCHAR(50) NOT NULL,
    nombreImagen VARCHAR(50) NOT NULL
};

-- Mostrar tablas
SHOW TABLES;

-- Describir la tabala
describe productos,
