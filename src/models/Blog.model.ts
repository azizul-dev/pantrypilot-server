import mongoose, { Schema } from 'mongoose';
import { IBlog } from '../types';

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      trim: true,
      maxlength: [250, 'Excerpt cannot exceed 250 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
      minlength: [50, 'Content must be at least 50 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Cover image is required'],
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    readTime: {
      type: String,
      default: '1 min read',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Auto-calculate readTime from content (≈200 words/min) ──────────────────
BlogSchema.pre('save', function (next) {
  if (this.isModified('content')) {
    const words = this.content.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    this.readTime = `${minutes} min read`;
  }
  next();
});

// ─── Indexes for search & filtering ──────────────────────────────────────────
BlogSchema.index({ title: 'text', excerpt: 'text', content: 'text' });
BlogSchema.index({ category: 1 });
BlogSchema.index({ authorId: 1 });
BlogSchema.index({ createdAt: -1 });

const Blog = mongoose.model<IBlog>('Blog', BlogSchema);
export default Blog;
