const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["categorize", "cloze", "comprehension"],
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: null,
  },
  options: [
    {
      text: String,
      category: String,
      isCorrect: Boolean,
    },
  ],
  categories: [String],
  blanks: [
    {
      text: String,
      answer: String,
    },
  ],
  passage: String,
  comprehensionQuestions: [
    {
      question: String,
      options: [String],
      correctAnswer: String,
    },
  ],
  required: {
    type: Boolean,
    default: false,
  },
});

const formSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  headerImage: {
    type: String,
    default: null,
  },
  questions: [questionSchema],
  isPublished: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

formSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Form", formSchema);
