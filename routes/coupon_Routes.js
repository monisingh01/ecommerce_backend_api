import express from "express"
import { createCoupon, getAllCoupon, updateCoupon, deleteCoupon } from "../controllers/coupon_controller.js"
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js"


const router = express.Router()

router.post('/create', authMiddleware, isAdmin, createCoupon)
router.get('/getAll', authMiddleware, isAdmin, getAllCoupon)
router.put('/update/:id', authMiddleware, isAdmin, updateCoupon)
router.delete('/delete/:id', authMiddleware, isAdmin, deleteCoupon)


export default router