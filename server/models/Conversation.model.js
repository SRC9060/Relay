import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true
    },
    sender: {
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      role: { type: String, default: '' },
      avatar: { type: String, default: '' }
    },
    timestamp: {
      type: String,
      default: () => new Date().toISOString()
    },
    body: {
      type: String,
      required: true
    }
  },
  {
    _id: false
  }
);

const conversationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    accountId: {
      type: String,
      required: true,
      index: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    preview: {
      type: String,
      default: ''
    },
    sender: {
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      role: { type: String, default: '' },
      avatar: { type: String, default: '' }
    },
    recipients: {
      type: [String],
      default: []
    },
    cc: {
      type: [String],
      default: []
    },
    responsibility: {
      type: String,
      enum: ['assistant', 'client', 'none', 'review'],
      default: 'assistant',
      index: true
    },
    confidenceScore: {
      type: Number,
      default: 0.95
    },
    aiReasoning: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      default: 'general',
      index: true
    },
    actionStatus: {
      type: String,
      enum: ['action_required', 'waiting', 'completed', 'resolved'],
      default: 'action_required',
      index: true
    },
    isImportant: {
      type: Boolean,
      default: false,
      index: true
    },
    isUnread: {
      type: Boolean,
      default: false,
      index: true
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true
    },
    lastMessageAt: {
      type: String,
      default: () => new Date().toISOString(),
      index: true
    },
    messages: {
      type: [messageSchema],
      default: []
    },
    draft: {
      body: { type: String, default: '' },
      updatedAt: { type: String, default: () => new Date().toISOString() }
    },
    needsReview: {
      type: Boolean,
      default: false,
      index: true
    },
    isManualOverride: {
      type: Boolean,
      default: false
    },
    manualOverrideAt: {
      type: String,
      default: null
    },
    manualDecision: {
      type: String,
      default: null
    },
    pendingSuggestion: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    suggestedResponsibility: {
      type: String,
      default: null
    },
    importantInformation: {
      type: [String],
      default: []
    },
    identifiedDates: {
      type: [mongoose.Schema.Types.Mixed],
      default: []
    },
    aiSummary: {
      type: String,
      default: ''
    },
    summaryDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    aiSource: {
      type: String,
      default: null
    },
    modelUsed: {
      type: String,
      default: null
    },
    handledAt: {
      type: String,
      default: null
    },
    handledBy: {
      type: String,
      default: null
    },
    delegatedAt: {
      type: String,
      default: null
    },
    delegatedBy: {
      type: String,
      default: null
    },
    clientAttentionReason: {
      type: String,
      default: null
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

// Helpful compound indexes for query efficiency
conversationSchema.index({ isArchived: 1, actionStatus: 1 });
conversationSchema.index({ isArchived: 1, responsibility: 1 });
conversationSchema.index({ accountId: 1, lastMessageAt: -1 });

export const Conversation = mongoose.model('Conversation', conversationSchema);
