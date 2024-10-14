const express = require('express');
const multer = require('multer');
const { 
    addProduct, 
    getProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct,
    productMediaUpload
} = require('../controllers/productController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

router
    .route('/')
    .post(protect, authorize('seller'), upload.array('media', 5), addProduct)
    .get(getProducts);

router
    .route('/:id')
    .get(getProductById)
    .put(protect, authorize('seller'), upload.array('media', 5), updateProduct)
    .delete(protect, authorize('seller'), deleteProduct);

module.exports = router;
