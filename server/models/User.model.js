import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    role: {
      type: String,
      enum: ['assistant', 'client', 'admin'],
      default: 'assistant'
    },
    title: {
      type: String,
      default: ''
    },
    avatar: {
      type: String,
      default: ''
    },
    clientName: {
      type: String,
      default: ''
    },
    clientId: {
      type: String,
      default: ''
    },
    assistantName: {
      type: String,
      default: ''
    },
    assistantId: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    },
    toObject: {
      transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

export const User = mongoose.model('User', userSchema);
