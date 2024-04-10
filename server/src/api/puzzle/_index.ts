import express from 'express'
import get_puzzle from './get_puzzle'
import daily from './daily'
import all from './all'

const router = express.Router()

router.use('/daily', daily)
router.use('/all', all)
router.use('/:id', get_puzzle)

export default router