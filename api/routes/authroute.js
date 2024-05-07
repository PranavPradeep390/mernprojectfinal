import express from 'express';
import { google, signup } from '../controllers/authcontroller.js';
import { signin ,signOut} from '../controllers/authcontroller.js';

const router = express.Router();

router.post("/signup",signup);

router.post("/signin",signin);

router.post('/google',google)

router.get('/signout',signOut)

export default router;