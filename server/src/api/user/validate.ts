import express from 'express';
import { SuccessResponse, ValidateResponseData } from '../../interfaces/Response';
import { authenticated } from '../../middlewares';
import Session from '../../db/interfaces/Session';

const router = express.Router();

router.use(authenticated)

router.get<{ session: Session }, SuccessResponse<ValidateResponseData>>('/', async (req, res) => {
  // session obtained from authenticated middleware
  const session = req.body.session as Session

  res.json({
    success: true,
    data: {
      user: session.user
    }
  })
});

export default router;