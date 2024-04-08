import express from 'express'
import { authenticated } from '../../middlewares'
import { WithSession } from '../../shared/interfaces/Request'

const router = express.Router()

router.use(authenticated)
router.post<WithSession, {}>('/', async (req, res) => {
  res.send('Route not set up yet')
})

export default router