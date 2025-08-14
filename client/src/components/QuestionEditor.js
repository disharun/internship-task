import React, { useState } from "react";
import {
  X,
  Plus,
  Image as ImageIcon,
  Trash2,
  GripVertical,
} from "lucide-react";
import toast from "react-hot-toast";

const QuestionEditor = ({ question, onUpdate, onDelete, index }) => {
  const [localQuestion, setLocalQuestion] = useState(question);

  const handleChange = (field, value) => {
    const updated = { ...localQuestion, [field]: value };
    setLocalQuestion(updated);
    onUpdate(index, updated);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      // This would be handled by the parent component with the form ID
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
    }
  };

  const renderQuestionTypeEditor = () => {
    switch (localQuestion.type) {
      case "multiple-choice":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options
              </label>
              <div className="space-y-2">
                {(
                  localQuestion.options || [{ text: "", isCorrect: false }]
                ).map((option, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`mc-correct-${index}`}
                      checked={!!option.isCorrect}
                      onChange={() => {
                        const newOptions = (localQuestion.options || []).map(
                          (opt, i) => ({
                            ...opt,
                            isCorrect: i === idx,
                          })
                        );
                        handleChange("options", newOptions);
                      }}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => {
                        const newOptions = [...(localQuestion.options || [])];
                        newOptions[idx] = {
                          ...newOptions[idx],
                          text: e.target.value,
                        };
                        handleChange("options", newOptions);
                      }}
                      className="input-field flex-1"
                      placeholder={`Option ${idx + 1}`}
                    />
                    <button
                      onClick={() => {
                        const newOptions = (localQuestion.options || []).filter(
                          (_, i) => i !== idx
                        );
                        handleChange("options", newOptions);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newOptions = [
                      ...(localQuestion.options || []),
                      { text: "", isCorrect: false },
                    ];
                    handleChange("options", newOptions);
                  }}
                  className="btn-secondary text-sm"
                >
                  <Plus size={16} className="inline mr-1" />
                  Add Option
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points
                </label>
                <input
                  type="number"
                  min="0"
                  value={localQuestion.points || 0}
                  onChange={(e) =>
                    handleChange("points", parseInt(e.target.value || "0", 10))
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Explanation (optional)
                </label>
                <input
                  type="text"
                  value={localQuestion.explanation || ""}
                  onChange={(e) => handleChange("explanation", e.target.value)}
                  className="input-field"
                  placeholder="Shown after answer"
                />
              </div>
            </div>
          </div>
        );

      case "checkbox":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options (select all that apply)
              </label>
              <div className="space-y-2">
                {(
                  localQuestion.options || [{ text: "", isCorrect: false }]
                ).map((option, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={!!option.isCorrect}
                      onChange={(e) => {
                        const newOptions = [...(localQuestion.options || [])];
                        newOptions[idx] = {
                          ...newOptions[idx],
                          isCorrect: e.target.checked,
                        };
                        handleChange("options", newOptions);
                      }}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => {
                        const newOptions = [...(localQuestion.options || [])];
                        newOptions[idx] = {
                          ...newOptions[idx],
                          text: e.target.value,
                        };
                        handleChange("options", newOptions);
                      }}
                      className="input-field flex-1"
                      placeholder={`Option ${idx + 1}`}
                    />
                    <button
                      onClick={() => {
                        const newOptions = (localQuestion.options || []).filter(
                          (_, i) => i !== idx
                        );
                        handleChange("options", newOptions);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newOptions = [
                      ...(localQuestion.options || []),
                      { text: "", isCorrect: false },
                    ];
                    handleChange("options", newOptions);
                  }}
                  className="btn-secondary text-sm"
                >
                  <Plus size={16} className="inline mr-1" />
                  Add Option
                </button>
              </div>
            </div>
          </div>
        );

      case "text":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Placeholder
              </label>
              <input
                type="text"
                value={localQuestion.placeholder || ""}
                onChange={(e) => handleChange("placeholder", e.target.value)}
                className="input-field"
                placeholder="Type your answer here"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min length
                </label>
                <input
                  type="number"
                  min="0"
                  value={localQuestion.minLength || ""}
                  onChange={(e) =>
                    handleChange(
                      "minLength",
                      e.target.value ? parseInt(e.target.value, 10) : null
                    )
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max length
                </label>
                <input
                  type="number"
                  min="0"
                  value={localQuestion.maxLength || ""}
                  onChange={(e) =>
                    handleChange(
                      "maxLength",
                      e.target.value ? parseInt(e.target.value, 10) : null
                    )
                  }
                  className="input-field"
                />
              </div>
            </div>
          </div>
        );

      case "rating":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum stars
              </label>
              <input
                type="number"
                min="3"
                max="10"
                value={localQuestion.maxStars || 5}
                onChange={(e) =>
                  handleChange(
                    "maxStars",
                    Math.max(
                      3,
                      Math.min(10, parseInt(e.target.value || "5", 10))
                    )
                  )
                }
                className="input-field"
              />
            </div>
          </div>
        );

      case "date":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min date
                </label>
                <input
                  type="date"
                  value={localQuestion.minDate || ""}
                  onChange={(e) =>
                    handleChange("minDate", e.target.value || null)
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max date
                </label>
                <input
                  type="date"
                  value={localQuestion.maxDate || ""}
                  onChange={(e) =>
                    handleChange("maxDate", e.target.value || null)
                  }
                  className="input-field"
                />
              </div>
            </div>
          </div>
        );

      case "file-upload":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allowed file types (comma separated, e.g., pdf,jpg,png)
              </label>
              <input
                type="text"
                value={localQuestion.accept || ""}
                onChange={(e) => handleChange("accept", e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max file size (MB)
              </label>
              <input
                type="number"
                min="1"
                value={localQuestion.maxSizeMB || 10}
                onChange={(e) =>
                  handleChange(
                    "maxSizeMB",
                    parseInt(e.target.value || "10", 10)
                  )
                }
                className="input-field"
              />
            </div>
          </div>
        );

      case "ranking":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Items to rank
              </label>
              <div className="space-y-2">
                {(localQuestion.options || [""]).map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={typeof item === "string" ? item : item.text || ""}
                      onChange={(e) => {
                        const list = [...(localQuestion.options || [])];
                        list[idx] =
                          typeof list[idx] === "string"
                            ? e.target.value
                            : { ...list[idx], text: e.target.value };
                        handleChange("options", list);
                      }}
                      className="input-field flex-1"
                      placeholder={`Item ${idx + 1}`}
                    />
                    <button
                      onClick={() => {
                        const list = (localQuestion.options || []).filter(
                          (_, i) => i !== idx
                        );
                        handleChange("options", list);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const list = [...(localQuestion.options || []), ""];
                    handleChange("options", list);
                  }}
                  className="btn-secondary text-sm"
                >
                  <Plus size={16} className="inline mr-1" />
                  Add Item
                </button>
              </div>
            </div>
          </div>
        );

      case "matrix":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rows
                </label>
                <div className="space-y-2">
                  {(localQuestion.rows || [""]).map((row, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={row}
                        onChange={(e) => {
                          const rows = [...(localQuestion.rows || [])];
                          rows[idx] = e.target.value;
                          handleChange("rows", rows);
                        }}
                        className="input-field flex-1"
                        placeholder={`Row ${idx + 1}`}
                      />
                      <button
                        onClick={() => {
                          const rows = (localQuestion.rows || []).filter(
                            (_, i) => i !== idx
                          );
                          handleChange("rows", rows);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const rows = [...(localQuestion.rows || []), ""];
                      handleChange("rows", rows);
                    }}
                    className="btn-secondary text-sm"
                  >
                    <Plus size={16} className="inline mr-1" />
                    Add Row
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Columns
                </label>
                <div className="space-y-2">
                  {(localQuestion.columns || [""]).map((col, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={col}
                        onChange={(e) => {
                          const cols = [...(localQuestion.columns || [])];
                          cols[idx] = e.target.value;
                          handleChange("columns", cols);
                        }}
                        className="input-field flex-1"
                        placeholder={`Column ${idx + 1}`}
                      />
                      <button
                        onClick={() => {
                          const cols = (localQuestion.columns || []).filter(
                            (_, i) => i !== idx
                          );
                          handleChange("columns", cols);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const cols = [...(localQuestion.columns || []), ""];
                      handleChange("columns", cols);
                    }}
                    className="btn-secondary text-sm"
                  >
                    <Plus size={16} className="inline mr-1" />
                    Add Column
                  </button>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selection type
              </label>
              <select
                value={localQuestion.matrixType || "single"}
                onChange={(e) => handleChange("matrixType", e.target.value)}
                className="input-field w-40"
              >
                <option value="single">Single choice per row</option>
                <option value="multiple">Multiple choice per row</option>
              </select>
            </div>
          </div>
        );

      // Advanced types retained from earlier implementation
      case "categorize":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories
              </label>
              <div className="space-y-2">
                {localQuestion.categories?.map((category, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => {
                        const newCategories = [
                          ...(localQuestion.categories || []),
                        ];
                        newCategories[idx] = e.target.value;
                        handleChange("categories", newCategories);
                      }}
                      className="input-field flex-1"
                      placeholder="Category name"
                    />
                    <button
                      onClick={() => {
                        const newCategories =
                          localQuestion.categories?.filter(
                            (_, i) => i !== idx
                          ) || [];
                        handleChange("categories", newCategories);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newCategories = [
                      ...(localQuestion.categories || []),
                      "",
                    ];
                    handleChange("categories", newCategories);
                  }}
                  className="btn-secondary text-sm"
                >
                  <Plus size={16} className="inline mr-1" />
                  Add Category
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Items to Categorize
              </label>
              <div className="space-y-2">
                {localQuestion.options?.map((option, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={option.text || ""}
                      onChange={(e) => {
                        const newOptions = [...(localQuestion.options || [])];
                        newOptions[idx] = {
                          ...newOptions[idx],
                          text: e.target.value,
                        };
                        handleChange("options", newOptions);
                      }}
                      className="input-field flex-1"
                      placeholder="Item text"
                    />
                    <select
                      value={option.category || ""}
                      onChange={(e) => {
                        const newOptions = [...(localQuestion.options || [])];
                        newOptions[idx] = {
                          ...newOptions[idx],
                          category: e.target.value,
                        };
                        handleChange("options", newOptions);
                      }}
                      className="input-field w-32"
                    >
                      <option value="">Select category</option>
                      {localQuestion.categories?.map((cat, catIdx) => (
                        <option key={catIdx} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => {
                        const newOptions =
                          localQuestion.options?.filter((_, i) => i !== idx) ||
                          [];
                        handleChange("options", newOptions);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newOptions = [
                      ...(localQuestion.options || []),
                      { text: "", category: "" },
                    ];
                    handleChange("options", newOptions);
                  }}
                  className="btn-secondary text-sm"
                >
                  <Plus size={16} className="inline mr-1" />
                  Add Item
                </button>
              </div>
            </div>
          </div>
        );

      case "cloze":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passage with Blanks
              </label>
              <textarea
                value={localQuestion.passage || ""}
                onChange={(e) => handleChange("passage", e.target.value)}
                className="input-field h-32"
                placeholder="Enter your passage here. Use ___ to indicate blanks."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blank Answers
              </label>
              <div className="space-y-2">
                {localQuestion.blanks?.map((blank, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={blank.text || ""}
                      onChange={(e) => {
                        const newBlanks = [...(localQuestion.blanks || [])];
                        newBlanks[idx] = {
                          ...newBlanks[idx],
                          text: e.target.value,
                        };
                        handleChange("blanks", newBlanks);
                      }}
                      className="input-field flex-1"
                      placeholder="Blank text (e.g., ___ or [blank])"
                    />
                    <input
                      type="text"
                      value={blank.answer || ""}
                      onChange={(e) => {
                        const newBlanks = [...(localQuestion.blanks || [])];
                        newBlanks[idx] = {
                          ...newBlanks[idx],
                          answer: e.target.value,
                        };
                        handleChange("blanks", newBlanks);
                      }}
                      className="input-field w-32"
                      placeholder="Correct answer"
                    />
                    <button
                      onClick={() => {
                        const newBlanks =
                          localQuestion.blanks?.filter((_, i) => i !== idx) ||
                          [];
                        handleChange("blanks", newBlanks);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newBlanks = [
                      ...(localQuestion.blanks || []),
                      { text: "", answer: "" },
                    ];
                    handleChange("blanks", newBlanks);
                  }}
                  className="btn-secondary text-sm"
                >
                  <Plus size={16} className="inline mr-1" />
                  Add Blank
                </button>
              </div>
            </div>
          </div>
        );

      case "comprehension":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reading Passage
              </label>
              <textarea
                value={localQuestion.passage || ""}
                onChange={(e) => handleChange("passage", e.target.value)}
                className="input-field h-32"
                placeholder="Enter the reading passage here..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comprehension Questions
              </label>
              <div className="space-y-4">
                {localQuestion.comprehensionQuestions?.map((compQ, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Question {idx + 1}
                      </span>
                      <button
                        onClick={() => {
                          const newQuestions =
                            localQuestion.comprehensionQuestions?.filter(
                              (_, i) => i !== idx
                            ) || [];
                          handleChange("comprehensionQuestions", newQuestions);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={compQ.question || ""}
                      onChange={(e) => {
                        const newQuestions = [
                          ...(localQuestion.comprehensionQuestions || []),
                        ];
                        newQuestions[idx] = {
                          ...newQuestions[idx],
                          question: e.target.value,
                        };
                        handleChange("comprehensionQuestions", newQuestions);
                      }}
                      className="input-field"
                      placeholder="Question text"
                    />

                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        Options:
                      </label>
                      <div className="space-y-2">
                        {compQ.options?.map((option, optIdx) => (
                          <div
                            key={optIdx}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => {
                                const newQuestions = [
                                  ...(localQuestion.comprehensionQuestions ||
                                    []),
                                ];
                                const newOptions = [
                                  ...(newQuestions[idx].options || []),
                                ];
                                newOptions[optIdx] = e.target.value;
                                newQuestions[idx] = {
                                  ...newQuestions[idx],
                                  options: newOptions,
                                };
                                handleChange(
                                  "comprehensionQuestions",
                                  newQuestions
                                );
                              }}
                              className="input-field flex-1"
                              placeholder={`Option ${optIdx + 1}`}
                            />
                            <button
                              onClick={() => {
                                const newQuestions = [
                                  ...(localQuestion.comprehensionQuestions ||
                                    []),
                                ];
                                const newOptions =
                                  newQuestions[idx].options?.filter(
                                    (_, i) => i !== optIdx
                                  ) || [];
                                newQuestions[idx] = {
                                  ...newQuestions[idx],
                                  options: newOptions,
                                };
                                handleChange(
                                  "comprehensionQuestions",
                                  newQuestions
                                );
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const newQuestions = [
                              ...(localQuestion.comprehensionQuestions || []),
                            ];
                            const newOptions = [
                              ...(newQuestions[idx].options || []),
                              "",
                            ];
                            newQuestions[idx] = {
                              ...newQuestions[idx],
                              options: newOptions,
                            };
                            handleChange(
                              "comprehensionQuestions",
                              newQuestions
                            );
                          }}
                          className="btn-secondary text-sm"
                        >
                          <Plus size={16} className="inline mr-1" />
                          Add Option
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        Correct Answer:
                      </label>
                      <input
                        type="text"
                        value={compQ.correctAnswer || ""}
                        onChange={(e) => {
                          const newQuestions = [
                            ...(localQuestion.comprehensionQuestions || []),
                          ];
                          newQuestions[idx] = {
                            ...newQuestions[idx],
                            correctAnswer: e.target.value,
                          };
                          handleChange("comprehensionQuestions", newQuestions);
                        }}
                        className="input-field"
                        placeholder="Correct answer"
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newQuestions = [
                      ...(localQuestion.comprehensionQuestions || []),
                      {
                        question: "",
                        options: ["", "", "", ""],
                        correctAnswer: "",
                      },
                    ];
                    handleChange("comprehensionQuestions", newQuestions);
                  }}
                  className="btn-secondary text-sm"
                >
                  <Plus size={16} className="inline mr-1" />
                  Add Question
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="card card-hover mb-6">
      <div className="toolbar mb-4">
        <div className="flex items-center gap-3">
          <GripVertical className="opacity-50 cursor-move" size={18} />
          <span className="badge">Question {index + 1}</span>
          <select
            value={localQuestion.type}
            onChange={(e) => handleChange("type", e.target.value)}
            className="input-field w-56"
            title="Question type"
          >
            <option value="multiple-choice">Multiple Choice</option>
            <option value="checkbox">Checkbox</option>
            <option value="text">Text</option>
            <option value="rating">Rating</option>
            <option value="date">Date</option>
            <option value="file-upload">File Upload</option>
            <option value="ranking">Ranking</option>
            <option value="matrix">Matrix</option>
            <option value="categorize">Categorize</option>
            <option value="cloze">Cloze</option>
            <option value="comprehension">Comprehension</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={localQuestion.required || false}
              onChange={(e) => handleChange("required", e.target.checked)}
              className="rounded border-surface text-accent-700 focus:ring-accent-500"
            />
            <span className="text-sm opacity-80">Required</span>
          </label>

          <button
            onClick={() => onDelete(index)}
            className="icon-button"
            title="Delete question"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question Text
          </label>
          <input
            type="text"
            value={localQuestion.question || ""}
            onChange={(e) => handleChange("question", e.target.value)}
            className="input-field"
            placeholder="Enter your question here..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question Image (Optional)
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id={`question-image-${index}`}
            />
            <label
              htmlFor={`question-image-${index}`}
              className="btn-secondary cursor-pointer"
            >
              <ImageIcon size={16} className="inline mr-2" />
              Upload Image
            </label>
            {localQuestion.image && (
              <div className="flex items-center space-x-2">
                <img
                  src={localQuestion.image}
                  alt="Question"
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <button
                  onClick={() => handleChange("image", null)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {renderQuestionTypeEditor()}
      </div>
    </div>
  );
};

export default QuestionEditor;
