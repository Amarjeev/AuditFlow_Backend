import Router from "express";
import authController from "./controllers/auth.controller";
import { validate } from "../../middlewares/validate.middleware";
import { authValidation } from "./auth.validation";
import checkAuthStatusController from "./controllers/checkAuthStatus.controller";
import refreshTokenController from "./controllers/refresh-token.controller";
import logoutController from "./controllers/logout.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const authRouter = Router();

authRouter.post("/login", authValidation, validate, authController);
authRouter.post("/token/refresh", refreshTokenController);
authRouter.get("/token/status", checkAuthStatusController);
authRouter.post("/logout", authMiddleware(["admin"]), logoutController);

export default authRouter;
