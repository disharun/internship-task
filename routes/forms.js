const express = require("express");
const router = express.Router();
const Form = require("../models/Form");
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Get all forms
router.get("/", async (req, res) => {
  try {
    const forms = await Form.find().sort({ createdAt: -1 });
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific form
router.get("/:id", async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new form
router.post("/", async (req, res) => {
  try {
    const form = new Form(req.body);
    const newForm = await form.save();
    res.status(201).json(newForm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a form
router.put("/:id", async (req, res) => {
  try {
    const form = await Form.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    res.json(form);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a form
router.delete("/:id", async (req, res) => {
  try {
    const form = await Form.findByIdAndDelete(req.params.id);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    res.json({ message: "Form deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload header image
router.post(
  "/:id/header-image",
  upload.single("headerImage"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const form = await Form.findByIdAndUpdate(
        req.params.id,
        { headerImage: `/uploads/${req.file.filename}` },
        { new: true }
      );

      if (!form) {
        return res.status(404).json({ message: "Form not found" });
      }

      res.json(form);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Upload question image
router.post(
  "/:id/questions/:questionIndex/image",
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const form = await Form.findById(req.params.id);
      if (!form) {
        return res.status(404).json({ message: "Form not found" });
      }

      const questionIndex = parseInt(req.params.questionIndex);
      if (questionIndex >= 0 && questionIndex < form.questions.length) {
        form.questions[questionIndex].image = `/uploads/${req.file.filename}`;
        await form.save();
        res.json(form);
      } else {
        res.status(400).json({ message: "Invalid question index" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
