import express from "express"
import {authMiddleware, isAdmin} from "../middlewares/authMiddleware.js"
import { createBlog, updateBlog, getAllBlog, deleteBlog, getBlog, likeBlog, dislikeBlog } from "../controllers/blog_controller.js"



const router = express.Router()


router.post('/createBlog',authMiddleware,isAdmin, createBlog)
router.put('/updateBlog/:id',authMiddleware,isAdmin,updateBlog)
router.get('/get/:id',getBlog)
router.get('/getAllBlog',getAllBlog)
router.delete('/delete/:id',deleteBlog)
router.put('/likeBlog',authMiddleware,likeBlog)
router.put('/dislikeBlog',authMiddleware,dislikeBlog)





export default router