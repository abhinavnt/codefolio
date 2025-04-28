import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserRole } from "../core/constants/user.enum";
import container from "../di/container";
import { IWishlistController } from "../core/interfaces/controller/IWishlistController";
import { TYPES } from "../di/types";

const router = express.Router();

const wishlistController = container.get<IWishlistController>(TYPES.WishistController);

router.get("/", authMiddleware([UserRole.USER]), wishlistController.getWishlist);

router.post("/:courseId", authMiddleware([UserRole.USER]), wishlistController.addToWishlist);

router.delete("/:courseId", authMiddleware([UserRole.USER]), wishlistController.removeFromWishlist);

router.get("/:courseId", authMiddleware([UserRole.USER]), wishlistController.getWishlistStatus);

export default router;
