import express from 'express'
import add_word from './add_word'
import get_current_user from './get_current_user'

const router = express.Router()

router.use('/add_word', add_word)
router.use('/get_current_user', get_current_user)

export default router