import mongoose from "mongoose";
import validator from "validator";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  role: "user" | "admin";
  password: string;
  location: {
    type: {
      type: String;
      default: "Point";
      enum: ["Point"];
    };
    coordinates: [Number];
    address: String;
    description: String;
  };
  passwordChangedAt: Date;
  passwordResetToken: String;
  passwordResetExpires: Date;
  createdAt: Date;
  active: {
    type: Boolean;
    default: true;
    select: false;
  };
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, "Please tell us your name"],
  },
  username: {
    type: String,
    required: [true, "Please tell us your preferred Username"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provied a valid email"],
  },
  avatar: {
    type: String,
    default:
      "https://pwco.com.sg/wp-content/uploads/2020/05/Generic-Profile-Placeholder-v3.png",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provied a password"],
    minlength: 8,
    select: false,
  },
  location: {
    type: {
      type: String,
      default: "Point",
      enum: ["Point"],
    },
    coordinates: [Number],
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  createdAt: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.index({ location: "2dsphere" });

const User = mongoose.model<IUser>("User", userSchema);

export default User;
