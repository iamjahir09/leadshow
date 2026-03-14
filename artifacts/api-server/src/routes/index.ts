import { Router, type IRouter } from "express";
import healthRouter from "./health";
import chatwootRouter from "./chatwoot";

const router: IRouter = Router();

router.use(healthRouter);
router.use(chatwootRouter);

export default router;
