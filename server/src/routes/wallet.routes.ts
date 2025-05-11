import express from "express";
import container from "../di/container";
import { IWalletController } from "../core/interfaces/controller/IWalletController";
import { TYPES } from "../di/types";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserRole } from "../core/constants/user.enum";


const router = express.Router();


const walletController=container.get<IWalletController>(TYPES.WalletController)

router.get('/:mentorId/transactions',authMiddleware([UserRole.USER]),walletController.getTransactions)
router.get('/:mentorId/balance',authMiddleware([UserRole.USER]),walletController.getBalance)
router.post('/:mentorId/withdraw',authMiddleware([UserRole.USER]),walletController.withdrawFunds)

//payout
router.get("/payout", authMiddleware([UserRole.ADMIN]), walletController.getPayoutRequests);
router.patch("/:requestId/status", authMiddleware([UserRole.ADMIN]), walletController.updatePayoutStatus);



export default router