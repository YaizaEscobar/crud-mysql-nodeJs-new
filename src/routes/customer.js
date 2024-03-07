const express = require('express');
const router = express.Router();
const multer = require('multer');
const customerController = require('../controllers/customerController');

// Configuración de multer para la carga de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/uploads'); // Directorio donde se guardarán las imágenes
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Usa el nombre original del archivo
    }
});

const upload = multer({ storage: storage });

// Rutas GET, POST, DELETE y UPDATE
router.get('/', customerController.list);
router.post('/add', upload.single('imagen'), customerController.save);
router.get('/delete/:id', customerController.delete);
router.get('/update/:id', customerController.editar);
router.post('/update/:id', customerController.update);
router.get('/listarPorPrecio', customerController.listarPorPrecio);
router.get('/listarPorCalidad', customerController.listarPorCalidad);


module.exports = router;

