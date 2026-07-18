import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../types";
import { BCRYPT_SALT_ROUNDS } from "../config/constants";

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [
        function (this: IUser) {
          return this.provider === "local";
        },
        "Password is required",
      ],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // never return password by default
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    avatar: {
      type: String,
      default: function (this: IUser) {
        return `https://api.dicebear.com/8.x/avataaars/svg?seed=${encodeURIComponent(this.email)}`;
      },
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Recipe",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  },
);

// ─── Hash password before saving ─────────────────────────────────────────────
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, BCRYPT_SALT_ROUNDS);
  next();
});

// ─── Instance method: compare password ───────────────────────────────────────
UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── Remove password from JSON responses ─────────────────────────────────────
UserSchema.set("toJSON", {
  transform: (_doc, ret) => {
    const obj = ret as unknown as Record<string, unknown>;
    delete obj.password;
    return obj;
  },
});

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
