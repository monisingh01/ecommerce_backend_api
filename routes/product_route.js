import express from 'express';
import { createProduct, getProduct, getAll, updateProduct, deleteProduct, addToWishlist } from '../controllers/product_controller.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';


const router = express.Router()

router.post('/create', authMiddleware, isAdmin, createProduct)
router.get('/get/:id', getProduct)
router.get('/getAll', getAll)
router.put('/:id', authMiddleware, isAdmin, updateProduct)
router.delete('/:id', authMiddleware, isAdmin, deleteProduct)
router.put('/addToWishlist',authMiddleware,addToWishlist)

export default router