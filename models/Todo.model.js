// const { string, boolean } = require('joi')
const mongoose = require("mongoose");
const uuid = require("uuid");

const Schema = mongoose.Schema;
const ObjectID = Schema.ObjectID;

const TodoSchema = new Schema(
  {
    title: { type: String },
    description: { type: String },
    status: {
      type: String,
      enum: ["pending", "completed", "deleted"],
      default: "pending",
    },
    user_id: {
      type: String,
      default: uuid.v4(),
      required: true,
      ref: "users",
    },
    // created_at: { type: Date, default: new Date}
  },
  { timestamps: true }
);

const TodoModel = mongoose.model("todos", TodoSchema);
module.exports = TodoModel;
