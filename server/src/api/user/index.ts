import express from 'express'
import signup from './signup'
import login from './login'
import logout from './logout'

const router = express.Router()

router.use('/signup', signup)
router.use('/login', login)
router.use('/logout', logout)

export default router