import express from 'express';
import { ErrorResponse, SuccessResponse, ValidateErrors, ValidateData } from '../../shared/interfaces/Response';
import { authenticated } from '../../middlewares';
import Session from '../../db/interfaces/Session';

const router = express.Router();

router.use(authenticated)

router.get<{ session: Session }, SuccessResponse<ValidateData> | ErrorResponse<ValidateErrors>>('/', async (req, res) => {
  // session obtained from authenticated middleware
  const session = req.body.session as Session

  res.json({
    success: true,
    data: {
      userId: session.userId
    }
  })
});

export default router;