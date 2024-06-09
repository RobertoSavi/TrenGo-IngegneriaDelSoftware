import Router from "express";
import * as handlers from "../handlers/googleAuthHandlers.mjs";

const router = Router();

router.get('/', handlers.googleAuthentication);


router.get('/callback', handlers.googleCallback);

export default router;