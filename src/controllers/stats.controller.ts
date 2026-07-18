import { Request, Response, NextFunction } from 'express';
import Recipe from '../models/Recipe.model';
import User from '../models/User.model';
import { sendSuccess } from '../utils/response.utils';

export const getStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [recipeCount, userCount, cuisineAgg] = await Promise.all([
      Recipe.countDocuments(),
      User.countDocuments(),
      Recipe.aggregate([
        { $group: { _id: '$cuisineType', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    const cuisineBreakdown = cuisineAgg.map((c) => ({
      name: c._id as string,
      count: c.count as number,
    }));

    sendSuccess(res, 'Stats fetched successfully.', {
      recipes: recipeCount,
      users: userCount,
      cuisines: cuisineBreakdown.length,
      cuisineBreakdown,
    });
  } catch (error) {
    next(error);
  }
};
