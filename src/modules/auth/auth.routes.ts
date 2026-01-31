import Router from "express";
import authController from "./controllers/login.controller";
import { validate } from "../../middlewares/validate.middleware";
import { loginValidation } from "./login.validation";
import checkAuthStatusController from "./controllers/checkAuthStatus.controller";
import refreshTokenController from "./controllers/refresh-token.controller";
import logoutController from "./controllers/logout.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const authRouter = Router();

authRouter.post("/login", loginValidation, validate, authController);
authRouter.post("/token/refresh", refreshTokenController);
authRouter.get("/token/status", checkAuthStatusController);
authRouter.post("/logout", authMiddleware(["admin","analyst"]), logoutController);

export default authRouter;
