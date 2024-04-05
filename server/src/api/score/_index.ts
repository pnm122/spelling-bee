import express from 'express'
import update from './update'
import get_current_user from './get_current_user'

const router = express.Router()

router.use('/update', update)
router.use('/get_current_user', get_current_user)

export default router