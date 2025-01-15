
import  express from 'express';
import switchRole from '../controller/switchRole.js';
const router = express.Router();
router.put("/users/:id/role", switchRole)
export default router;

