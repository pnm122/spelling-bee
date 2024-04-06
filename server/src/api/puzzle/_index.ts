import express from 'express'
import get_puzzle from './get_puzzle'
import daily from './daily'

const router = express.Router()

router.use('/daily', daily)
router.use('/:id', get_puzzle)

export default router