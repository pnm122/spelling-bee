import express from 'express'
import signup from './signup'
import login from './login'
import logout from './logout'
import validate from './validate'
import getUser from './get_user'

const router = express.Router()

router.use('/signup', signup)
router.use('/login', login)
router.use('/logout', logout)
router.use('/validate', validate)
router.use('/get_user', getUser)

export default router