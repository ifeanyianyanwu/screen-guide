import { getUserById, updateUserById } from "../database/models/user.model";
import { sendErrorResponse } from "../helpers";
import {
  RemoveWatchListItemParamsSchema,
  WatchListItemSchema,
} from "../schemas/watch-list";
import { ExpressRouteHandler, User } from "../types";

export const addToWatchList: ExpressRouteHandler = async (req, res) => {
  try {
    const validationResult = WatchListItemSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        errors: validationResult.error.errors.map((item) => item.message),
      });
    }

    const userId = req.user!._id;
    const item = validationResult.data;

    const user = (await getUserById(userId)) as User | null;
    if (!user) {
      return sendErrorResponse(res, 404, "User not found");
    }

    const items = user.watchList?.items ?? [];

    if (items.some((i) => i.mediaId === item.mediaId)) {
      return sendErrorResponse(
        res,
        409,
        "This media is already in your watchlist"
      );
    }

    // Only update the watch list (spreading a Mongoose document copies its
    // internal state, not just the user's fields).
    const updatedUser = await updateUserById(userId, {
      watchList: { items: [...items, item] },
    });

    if (!updatedUser) {
      return sendErrorResponse(res, 404, "User not found");
    }

    return res.status(200).json({
      success: true,
      message: "Item added to Watchlist",
      data: updatedUser.watchList,
    });
  } catch (error) {
    console.error("Add to watch list error:", error);
    return sendErrorResponse(res, 500, "Internal server error");
  }
};

export const removeFromWatchList: ExpressRouteHandler = async (req, res) => {
  try {
    const validationResult = RemoveWatchListItemParamsSchema.safeParse(
      req.params
    );
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        errors: validationResult.error.errors.map((item) => item.message),
      });
    }

    const userId = req.user!._id;
    const {
      data: { id },
    } = validationResult;

    const user = await getUserById(userId);
    if (!user) {
      return sendErrorResponse(res, 404, "User not found");
    }

    const items = user.watchList?.items ?? [];

    if (!items.some((item) => item.id === id)) {
      return sendErrorResponse(res, 404, "No corresponding media found");
    }

    const updatedWatchList = items.filter((item) => item.id !== id);

    const updatedUser = await updateUserById(userId, {
      watchList: { items: updatedWatchList },
    });

    if (!updatedUser) {
      return sendErrorResponse(res, 404, "Update failed");
    }

    return res.status(200).json({
      success: true,
      message: "Item removed from Watchlist",
      data: updatedUser.watchList,
    });
  } catch (error) {
    console.error("Remove from watch list error:", error);
    return sendErrorResponse(res, 500, "Internal server error");
  }
};

export const getWatchList: ExpressRouteHandler = async (req, res) => {
  try {
    const userId = req.user!._id;

    const user = await getUserById(userId);

    if (!user) {
      return sendErrorResponse(res, 404, "User not found");
    }

    res.status(200).json({ success: true, data: user.watchList });
  } catch (error) {
    console.error("Get watch list error:", error);
    return sendErrorResponse(res, 500, "Internal server error");
  }
};
