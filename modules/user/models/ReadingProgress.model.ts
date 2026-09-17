import mongoose from "mongoose";

const ReadingProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    bookUUID: {
      type: String,
      required: true,
      index: true,
    },
    pageNumber: {
      type: Number,
      required: true,
      default: 1,
    },
    language: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["reader", "translator"],
      default: "reader",
    },
  },
  {
    timestamps: true,
  }
);

ReadingProgressSchema.index({ userId: 1, bookUUID: 1, role: 1 }, { unique: true });

const ReadingProgress =
  mongoose.models.ReadingProgress ||
  mongoose.model("ReadingProgress", ReadingProgressSchema);

export default ReadingProgress;
