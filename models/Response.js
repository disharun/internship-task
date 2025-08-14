const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  answer: mongoose.Schema.Types.Mixed,
  questionType: {
    type: String,
    enum: ["categorize", "cloze", "comprehension"],
    required: true,
  },
});

const responseSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Form",
    required: true,
  },
  answers: [answerSchema],
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  userInfo: {
    name: String,
    email: String,
    ip: String,
  },
});

module.exports = mongoose.model("Response", responseSchema);
