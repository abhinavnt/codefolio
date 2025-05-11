import { RequestHandler } from "express"

export interface IWalletController{
    getTransactions:RequestHandler
    getBalance:RequestHandler
    withdrawFunds:RequestHandler

    getPayoutRequests:RequestHandler
    updatePayoutStatus:RequestHandler
}