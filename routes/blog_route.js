import express from "express"
import {authMiddleware, isAdmin} from "../middlewares/authMiddleware.js"
import { createBlog, updateBlog, getAllBlog, deleteBlog } from "../controllers/blog_controller.js"



const router = express.Router()


router.post('/createBlog',authMiddleware,isAdmin, createBlog)
router.put('/updateBlog/:id',authMiddleware,isAdmin,updateBlog)
router.get('/getAllBlog',getAllBlog)
router.delete('/delete/:id',deleteBlog)





export default router