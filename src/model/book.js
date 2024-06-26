import { Schema, model } from "mongoose";

const bookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  publishedDate: { type: Date, required: true },
  ISBN: { type: String, required: true, unique: true },
});

export default model("Book", bookSchema);
