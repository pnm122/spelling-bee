import express from 'express'
import add_word from './add_word'
import get_current_user from './get_current_user'
import activate_word_previews from './activate_word_previews'
import set_hint from './set_hint'

const router = express.Router()

router.use('/add_word', add_word)
router.use('/get_current_user', get_current_user)
router.use('/activate_word_previews', activate_word_previews)
router.use('/set_hint', set_hint)

export default router