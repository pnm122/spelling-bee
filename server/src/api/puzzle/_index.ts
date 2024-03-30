import express from 'express'
import get_puzzle from './get_puzzle'
import daily from './daily'

const router = express.Router()

router.use('/:id', get_puzzle)
router.use('/daily', daily)

export default router