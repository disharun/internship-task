const express = require("express");
const router = express.Router();
const Response = require("../models/Response");
const Form = require("../models/Form");

// Get all responses for a form
router.get("/form/:formId", async (req, res) => {
  try {
    const responses = await Response.find({ formId: req.params.formId }).sort({
      submittedAt: -1,
    });
    res.json(responses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific response
router.get("/:id", async (req, res) => {
  try {
    const response = await Response.findById(req.params.id);
    if (!response) {
      return res.status(404).json({ message: "Response not found" });
    }
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit a new response
router.post("/", async (req, res) => {
  try {
    // Verify form exists and is published
    const form = await Form.findById(req.body.formId);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    if (!form.isPublished) {
      return res.status(400).json({ message: "Form is not published" });
    }

    const response = new Response(req.body);
    const newResponse = await response.save();
    res.status(201).json(newResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a response
router.delete("/:id", async (req, res) => {
  try {
    const response = await Response.findByIdAndDelete(req.params.id);
    if (!response) {
      return res.status(404).json({ message: "Response not found" });
    }
    res.json({ message: "Response deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
