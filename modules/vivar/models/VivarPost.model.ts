import mongoose from "mongoose";

const VivarPostSchema = new mongoose.Schema(
  {
    selectedText: {
      type: String,
      required: true,
      trim: true,
    },
    caption: {
      type: String,
      default: "",
      trim: true,
    },
    bookUUID: {
      type: String,
      required: true,
    },
    bookTitle: {
      type: String,
      required: true,
    },
    pageNumber: {
      type: Number,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    sourceVersionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PageVersion",
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const VivarPost =
  mongoose.models.VivarPost || mongoose.model("VivarPost", VivarPostSchema);

export default VivarPost;
