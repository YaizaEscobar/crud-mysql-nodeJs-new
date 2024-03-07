const controller = {};
const fs = require('fs');

// Listar productos de la BD
controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error de conexión:', err);
            return res.status(500).send('Error de conexión a la base de datos');
        }
        // Modifica tu consulta SQL para unir la tabla productosLab con la tabla calidad
        conn.query('SELECT p.*, c.calidadProducto FROM productosLab p LEFT JOIN calidad c ON p.id_calidad = c.id', (err, productos) => {
            if (err) {
                console.error('Error al obtener productos:', err);
                return res.status(500).send('Error al obtener productos de la base de datos');
            }
            // Iterar sobre los productos y codificar las imágenes como base64
            productos.forEach(producto => {
                producto.imagenBase64 = Buffer.from(producto.imagen, 'binary').toString('base64');
            });
            res.render('productos', {
                data: productos
            });
        });
    });
};

// Guardar datos en la BD
controller.save = (req, res) => {
    const data = req.body;
    const imagen = req.file;

    console.log(imagen);
    if (!imagen) {
        return res.status(400).send('Debe subir una imagen');
    }
    // Leer el archivo de la ruta temporal
    fs.readFile(imagen.path, (err, fileData) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return res.status(500).send('Error al leer el archivo subido');
        }
        // Guardar la imagen como BLOB en la base de datos
        data.imagen = fileData;
        data.nombreImagen = imagen.originalname;
        req.getConnection((err, conn) => {
            if (err) {
                console.error('Error de conexión:', err);
                return res.status(500).send('Error de conexión a la base de datos');
            }
            conn.query('INSERT INTO productosLab SET ?', data, (err, result) => {
                if (err) {
                    console.error('Error al insertar datos:', err);
                    return res.status(500).send('Error al insertar datos en la base de datos');
                }
                res.redirect('/');
            });
        });
    });
};

// Obtener un producto para editar por su id
controller.editar = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM productosLab WHERE id = ?', [id], (err, productos) => {
            if (err) {
                console.error('Error al obtener el producto:', err);
                return res.status(500).send('Error al obtener el producto de la base de datos');
            }
            console.log(productos[0]);
            res.render('productos_editar', {
                data: productos[0]
            });
        });
    });
};

// Actualizar el producto editado
controller.update = (req, res) => {
    const { id } = req.params;
    const nuevoProducto = req.body;
    // Actualizar la fecha de modificación al momento de la actualización
    nuevoProducto.fecha_modificacion = new Date().toISOString().slice(0, 19).replace('T', ' ');

    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error de conexión:', err);
            return res.status(500).send('Error de conexión a la base de datos');
        }
        conn.query('UPDATE productosLab SET ? WHERE id = ?', [nuevoProducto, id], (err, productos) => {
            if (err) {
                console.error('Error al actualizar el producto:', err);
                return res.status(500).send('Error al actualizar el producto en la base de datos');
            }
            res.redirect('/');
        });
    });
};

// Eliminar un producto de la base de datos por su id
controller.delete = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error de conexión:', err);
            return res.status(500).send('Error de conexión a la base de datos');
        }
        conn.query('DELETE FROM productosLab WHERE id = ?', [id], (err, productos) => {
            if (err) {
                console.error('Error al eliminar el producto:', err);
                return res.status(500).send('Error al eliminar el producto de la base de datos');
            }
            res.redirect('/');
        });
    });
};

// Añadir una nueva función al controlador para listar los productos ordenados por precio de menor a mayor
controller.listarPorPrecio = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error de conexión:', err);
            return res.status(500).send('Error de conexión a la base de datos');
        }
        conn.query('SELECT p.*, c.calidadProducto FROM productosLab p LEFT JOIN calidad c ON p.id_calidad = c.id ORDER BY p.precio ASC', (err, productos) => {
            if (err) {
                console.error('Error al obtener productos:', err);
                return res.status(500).send('Error al obtener productos de la base de datos');
            }
            // Iterar sobre los productos y codificar las imágenes como base64
            productos.forEach(producto => {
                producto.imagenBase64 = Buffer.from(producto.imagen, 'binary').toString('base64');
            });
            res.render('productos', {
                data: productos
            });
        });
    });
};

// Listar productos de la BD agrupados por calidad
controller.listarPorCalidad = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error de conexión:', err);
            return res.status(500).send('Error de conexión a la base de datos');
        }
        // Modifica tu consulta SQL para ordenar por calidad
        conn.query('SELECT p.*, c.calidadProducto FROM productosLab p LEFT JOIN calidad c ON p.id_calidad = c.id ORDER BY c.calidadProducto', (err, productos) => {
            if (err) {
                console.error('Error al obtener productos:', err);
                return res.status(500).send('Error al obtener productos de la base de datos');
            }
            // Iterar sobre los productos y codificar las imágenes como base64
            productos.forEach(producto => {
                producto.imagenBase64 = Buffer.from(producto.imagen, 'binary').toString('base64');
            });
            res.render('productos', {
                data: productos
            });
        });
    });
};

module.exports = controller;
