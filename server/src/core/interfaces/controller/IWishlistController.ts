import { RequestHandler } from "express";

export interface IWishlistController {
  getWishlistStatus: RequestHandler;
  addToWishlist: RequestHandler;
  removeFromWishlist: RequestHandler;
}
