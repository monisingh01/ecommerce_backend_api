import express from "express"
import { register, login, getAll, getUser, deleteUser, updateUser, blockUser, unblockUser, handleRefreshToken , logout, updatePassword,forgetPasswordToken , resetPassword} from "../controllers/user_controller.js"
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js"

const router = express.Router()


router.post('/register', register)
router.post('/login', login)
router.post('/forgot-password-token',forgetPasswordToken)
router.post('/resetPassword',authMiddleware,resetPassword)

router.get('/getAll', getAll)
router.get('/get/:id', authMiddleware, isAdmin, getUser)
router.get('/refresh', handleRefreshToken)
router.get('/logout',logout)
 router.put('/password',authMiddleware, updatePassword)
 router.delete('/:id', deleteUser)
router.put('/edit-user', authMiddleware, updateUser)
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser)
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser)


export default router