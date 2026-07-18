import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import * as blogService from '../services/blog.service';
import { sendSuccess, sendError } from '../utils/response.utils';

export const getBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      category,
      search,
      authorId,
      page = '1',
      limit = '9',
      sortBy = '-createdAt',
    } = req.query;

    const result = await blogService.getAllBlogs({
      category: category as string,
      search: search as string,
      authorId: authorId as string,
      page: parseInt(page as string, 10),
      limit: Math.min(parseInt(limit as string, 10), 50),
      sortBy: sortBy as string,
    });

    sendSuccess(res, 'Blog posts fetched successfully.', result);
  } catch (error) {
    next(error);
  }
};

export const getBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const post = await blogService.getBlogById(req.params.id);
    sendSuccess(res, 'Blog post fetched successfully.', { post });
  } catch (error) {
    next(error);
  }
};

export const createBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendError(res, errors.array()[0].msg, 400);
      return;
    }

    if (!req.user) {
      sendError(res, 'Not authenticated.', 401);
      return;
    }

    const post = await blogService.createBlog(req.body, req.user.id);
    sendSuccess(res, 'Blog post created successfully.', { post }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Not authenticated.', 401);
      return;
    }

    const post = await blogService.updateBlog(
      req.params.id,
      req.body,
      req.user.id,
      req.user.role
    );
    sendSuccess(res, 'Blog post updated successfully.', { post });
  } catch (error) {
    next(error);
  }
};

export const deleteBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Not authenticated.', 401);
      return;
    }

    await blogService.deleteBlog(req.params.id, req.user.id, req.user.role);
    sendSuccess(res, 'Blog post deleted successfully.', null);
  } catch (error) {
    next(error);
  }
};

export const getMyBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Not authenticated.', 401);
      return;
    }

    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit as string, 10) || 10, 50);
    const sortBy = (req.query.sortBy as string) || '-createdAt';

    const result = await blogService.getMyBlogs(req.user.id, page, limit, sortBy);

    sendSuccess(res, 'Your blog posts fetched successfully.', result);
  } catch (error) {
    next(error);
  }
};
