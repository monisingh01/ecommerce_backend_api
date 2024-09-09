import express from "express"
import { register, login, getAll, getUser, deleteUser, updateUser, blockUser, unblockUser, handleRefreshToken , logout} from "../controllers/user_controller.js"
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js"

const router = express.Router()


router.post('/register', register)
router.post('/login', login)
router.get('/getAll', getAll)
router.get('/:id', authMiddleware, isAdmin, getUser)
router.get('/refresh', handleRefreshToken)
router.get('/logout',logout)


router.delete('/:id', deleteUser)
router.put('/edit-user', authMiddleware, updateUser)
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser)
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser)


export default router