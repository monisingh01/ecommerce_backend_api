import express from "express"
import { createCategory, deleteCategory, updateCategory, getAllCategory, getSingleCategory } from "../controllers/product_category_controller.js"
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js"


const router = express.Router()


router.post('/create', authMiddleware, isAdmin, createCategory)
router.put('/update', authMiddleware, isAdmin, updateCategory)
router.delete('/delete/:id', authMiddleware, isAdmin, deleteCategory)
router.get('/getAllCategory', getAllCategory)
router.get('/get/:id', getSingleCategory)




export default router