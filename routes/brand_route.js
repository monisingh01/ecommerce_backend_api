import express from "express";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";
import { createBrand , updateBrand, deleteBrand , getBrandById , getAllBrand} from "../controllers/brand_controller.js";
 

const router = express.Router()


router.post('/create', authMiddleware, isAdmin, createBrand)
router.put('/updateBrand/:id',authMiddleware,isAdmin, updateBrand)
router.delete('/deleteBrand/:id',authMiddleware,isAdmin,deleteBrand)
router.get('/get/:id',getBrandById)
router.get('/getAllBrand',getAllBrand)


export default router