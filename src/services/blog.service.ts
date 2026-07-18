import Blog from '../models/Blog.model';
import { IBlog } from '../types';
import { createError } from '../utils/response.utils';
import mongoose from 'mongoose';

export interface BlogFilters {
  category?: string;
  search?: string;
  authorId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
}

export interface PaginatedBlogs {
  posts: IBlog[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export const getAllBlogs = async (filters: BlogFilters): Promise<PaginatedBlogs> => {
  const {
    category,
    search,
    authorId,
    page = 1,
    limit = 9,
    sortBy = '-createdAt',
  } = filters;

  const query: mongoose.FilterQuery<IBlog> = {};

  if (category) query.category = new RegExp(category, 'i');
  if (authorId) query.authorId = authorId;
  if (search) query.$text = { $search: search };

  const skip = (page - 1) * limit;
  const [posts, total] = await Promise.all([
    Blog.find(query)
      .populate('authorId', 'name avatar email')
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .lean(),
    Blog.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    posts: posts as unknown as IBlog[],
    total,
    page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

export const getBlogById = async (id: string): Promise<IBlog> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError('Invalid blog post ID.', 400);
  }

  const post = await Blog.findById(id).populate('authorId', 'name avatar email');
  if (!post) {
    throw createError('Blog post not found.', 404);
  }
  return post;
};

export const createBlog = async (
  data: Partial<IBlog>,
  authorId: string
): Promise<IBlog> => {
  const post = await Blog.create({ ...data, authorId });
  return post;
};

export const updateBlog = async (
  id: string,
  data: Partial<IBlog>,
  requesterId: string,
  requesterRole: string
): Promise<IBlog> => {
  const post = await Blog.findById(id);
  if (!post) throw createError('Blog post not found.', 404);

  if (
    post.authorId.toString() !== requesterId &&
    requesterRole !== 'admin'
  ) {
    throw createError('You are not authorized to update this post.', 403);
  }

  delete (data as Partial<IBlog> & { readTime?: string }).readTime;

  const updated = await Blog.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate('authorId', 'name avatar email');

  if (data.content && updated) {
    const words = updated.content.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    updated.readTime = `${minutes} min read`;
    await updated.save();
  }

  return updated!;
};

export const deleteBlog = async (
  id: string,
  requesterId: string,
  requesterRole: string
): Promise<void> => {
  const post = await Blog.findById(id);
  if (!post) throw createError('Blog post not found.', 404);

  if (
    post.authorId.toString() !== requesterId &&
    requesterRole !== 'admin'
  ) {
    throw createError('You are not authorized to delete this post.', 403);
  }

  await Blog.findByIdAndDelete(id);
};

export const getMyBlogs = async (
  authorId: string,
  page = 1,
  limit = 10,
  sortBy = '-createdAt'
): Promise<PaginatedBlogs> => {
  const skip = (page - 1) * limit;
  const [posts, total] = await Promise.all([
    Blog.find({ authorId })
      .populate('authorId', 'name avatar email')
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .lean(),
    Blog.countDocuments({ authorId }),
  ]);

  const totalPages = Math.ceil(total / limit);
  return {
    posts: posts as unknown as IBlog[],
    total,
    page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};
