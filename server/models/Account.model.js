import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    provider: {
      type: String,
      enum: ['gmail', 'outlook', 'custom'],
      default: 'gmail'
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    emailAddress: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    connectionStatus: {
      type: String,
      enum: ['connected', 'disconnected', 'syncing'],
      default: 'connected'
    },
    isSimulated: {
      type: Boolean,
      default: true
    },
    lastSyncedAt: {
      type: String,
      default: () => new Date().toISOString()
    },
    totalEmails: {
      type: Number,
      default: 0
    },
    actionRequiredCount: {
      type: Number,
      default: 0
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

export const Account = mongoose.model('Account', accountSchema);
