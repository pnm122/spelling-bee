import express from 'express'
import { authenticated } from '../../middlewares'
import { WithSession } from '../../shared/interfaces/Request'

const router = express.Router()

router.use(authenticated)
router.get<WithSession, {}>('/', (req, res) => {
  
})

export default router