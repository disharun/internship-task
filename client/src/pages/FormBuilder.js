import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Save,
  Eye,
  Plus,
  ArrowLeft,
  Settings,
  Palette,
  EyeOff,
  Share2,
  Copy,
  Download,
  BarChart3,
  Users,
  Clock,
  Lock,
  Globe,
  Trash2,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import QuestionEditor from "../components/QuestionEditor";

const FormBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "Untitled Form",
    description: "",
    headerImage: null,
    questions: [],
    isPublished: false,
    settings: {
      allowMultipleAttempts: false,
      timeLimit: null,
      requireAuthentication: false,
      showProgressBar: true,
      randomizeQuestions: false,
      theme: "default",
    },
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("questions");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (id) {
      fetchForm();
    }
  }, [id]);

  const fetchForm = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/forms/${id}`);
      setForm(response.data);
    } catch (error) {
      toast.error("Failed to fetch form");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSettingsChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      settings: { ...prev.settings, [field]: value },
    }));
  };

  const handleQuestionUpdate = (index, updatedQuestion) => {
    const newQuestions = [...form.questions];
    newQuestions[index] = updatedQuestion;
    setForm((prev) => ({ ...prev, questions: newQuestions }));
  };

  const handleQuestionDelete = (index) => {
    const newQuestions = form.questions.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, questions: newQuestions }));
  };

  const addQuestion = () => {
    const newQuestion = {
      type: "multiple-choice",
      question: "",
      image: null,
      required: false,
      options: [{ text: "", isCorrect: false }],
      explanation: "",
      points: 1,
    };
    setForm((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  const duplicateQuestion = (index) => {
    const questionToDuplicate = { ...form.questions[index] };
    questionToDuplicate.question = `${questionToDuplicate.question} (Copy)`;
    setForm((prev) => ({
      ...prev,
      questions: [...prev.questions, questionToDuplicate],
    }));
  };

  const moveQuestion = (fromIndex, toIndex) => {
    const newQuestions = [...form.questions];
    const [movedQuestion] = newQuestions.splice(fromIndex, 1);
    newQuestions.splice(toIndex, 0, movedQuestion);
    setForm((prev) => ({ ...prev, questions: newQuestions }));
  };

  const handleHeaderImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("headerImage", file);

    try {
      if (id) {
        const response = await axios.post(
          `/api/forms/${id}/header-image`,
          formData
        );
        setForm(response.data);
        toast.success("Header image uploaded successfully");
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          setForm((prev) => ({ ...prev, headerImage: e.target.result }));
        };
        reader.readAsDataURL(file);
        toast.success("Header image added");
      }
    } catch (error) {
      toast.error("Failed to upload image");
    }
  };

  const saveForm = async () => {
    try {
      setSaving(true);
      if (id) {
        await axios.put(`/api/forms/${id}`, form);
        toast.success("Form updated successfully");
      } else {
        const response = await axios.post("/api/forms", form);
        toast.success("Form created successfully");
        navigate(`/form-builder/${response.data._id}`);
      }
    } catch (error) {
      toast.error("Failed to save form");
    } finally {
      setSaving(false);
    }
  };

  const publishForm = async () => {
    try {
      setSaving(true);
      const updatedForm = { ...form, isPublished: true };
      if (id) {
        await axios.put(`/api/forms/${id}`, updatedForm);
        setForm(updatedForm);
        toast.success("Form published successfully");
      }
    } catch (error) {
      toast.error("Failed to publish form");
    } finally {
      setSaving(false);
    }
  };

  const getQuestionTypeIcon = (type) => {
    const icons = {
      "multiple-choice": "🔘",
      checkbox: "☑️",
      text: "📝",
      rating: "⭐",
      date: "📅",
      "file-upload": "📎",
      ranking: "📊",
      matrix: "📋",
    };
    return icons[type] || "❓";
  };

  if (loading) {
    return (
      <div className="min-h-screen app-bg flex items-center justify-center">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
            style={{ borderColor: "var(--primary-600)" }}
          ></div>
          <p className="mt-4 opacity-80">Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen app-bg">
      {/* Header */}
      <div className="bg-surface border-b border-surface sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="p-2 hover-accent-50 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleFormChange("title", e.target.value)}
                  className="text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-0 px-0 py-0 min-w-[200px]"
                  placeholder="Untitled Form"
                />
                <span className="opacity-40">|</span>
                <span className="text-sm opacity-70">
                  {form.questions.length} questions
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="btn-secondary flex items-center space-x-2"
              >
                {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
                <span>{showPreview ? "Hide Preview" : "Preview"}</span>
              </button>

              <button
                onClick={saveForm}
                disabled={saving}
                className="btn-primary flex items-center space-x-2"
              >
                <Save size={16} />
                <span>{saving ? "Saving..." : "Save"}</span>
              </button>

              {!form.isPublished && (
                <button
                  onClick={publishForm}
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  <Globe size={16} />
                  <span>Publish</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Question Types */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Question Types</h3>
              <div className="space-y-2">
                {[
                  {
                    type: "multiple-choice",
                    label: "Multiple Choice",
                    icon: "🔘",
                  },
                  { type: "checkbox", label: "Checkbox", icon: "☑️" },
                  { type: "text", label: "Text Input", icon: "📝" },
                  { type: "rating", label: "Rating", icon: "⭐" },
                  { type: "date", label: "Date Picker", icon: "📅" },
                  { type: "file-upload", label: "File Upload", icon: "📎" },
                  { type: "ranking", label: "Ranking", icon: "📊" },
                  { type: "matrix", label: "Matrix", icon: "📋" },
                ].map((questionType) => (
                  <button
                    key={questionType.type}
                    onClick={() => {
                      const newQuestion = {
                        type: questionType.type,
                        question: "",
                        image: null,
                        required: false,
                        options:
                          questionType.type === "multiple-choice" ||
                          questionType.type === "checkbox"
                            ? [{ text: "", isCorrect: false }]
                            : [],
                        explanation: "",
                        points: 1,
                      };
                      setForm((prev) => ({
                        ...prev,
                        questions: [...prev.questions, newQuestion],
                      }));
                    }}
                    className="w-full text-left p-3 rounded-lg border border-surface hover-accent-50 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{questionType.icon}</span>
                      <span className="font-medium opacity-90 group-hover:text-accent-700">
                        {questionType.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* Form Header */}
            <div className="card mb-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium opacity-80 mb-2">
                    Form Title
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => handleFormChange("title", e.target.value)}
                    className="input-field text-lg font-semibold"
                    placeholder="Enter form title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium opacity-80 mb-2">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      handleFormChange("description", e.target.value)
                    }
                    className="input-field resize-none"
                    rows={3}
                    placeholder="Describe what this form is about..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium opacity-80 mb-2">
                    Header Image
                  </label>
                  <div className="flex items-center space-x-4">
                    {form.headerImage && (
                      <img
                        src={form.headerImage}
                        alt="Header"
                        className="w-32 h-20 object-cover rounded-lg border border-surface"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHeaderImageUpload}
                      className="block w-full text-sm opacity-80 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent-50 file:text-accent-700 hover:file:bg-accent-50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {form.questions.map((question, index) => (
                <div key={index} className="card group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">
                        {getQuestionTypeIcon(question.type)}
                      </span>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {question.type.replace("-", " ")}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => duplicateQuestion(index)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Duplicate question"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        onClick={() => handleQuestionDelete(index)}
                        className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                        title="Delete question"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <QuestionEditor
                    question={question}
                    onUpdate={handleQuestionUpdate}
                    onDelete={handleQuestionDelete}
                    index={index}
                  />
                </div>
              ))}

              {form.questions.length === 0 && (
                <div className="card text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Plus size={48} className="mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No questions yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Start building your form by adding questions from the
                    sidebar
                  </p>
                  <button onClick={addQuestion} className="btn-primary">
                    Add Your First Question
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Settings & Preview */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Form Settings */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Settings size={20} />
                  <span>Settings</span>
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={form.settings.showProgressBar}
                        onChange={(e) =>
                          handleSettingsChange(
                            "showProgressBar",
                            e.target.checked
                          )
                        }
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">
                        Show progress bar
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={form.settings.allowMultipleAttempts}
                        onChange={(e) =>
                          handleSettingsChange(
                            "allowMultipleAttempts",
                            e.target.checked
                          )
                        }
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">
                        Allow multiple attempts
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={form.settings.randomizeQuestions}
                        onChange={(e) =>
                          handleSettingsChange(
                            "randomizeQuestions",
                            e.target.checked
                          )
                        }
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">
                        Randomize questions
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="text-sm text-gray-700 mb-2 block">
                      Time Limit (minutes)
                    </label>
                    <input
                      type="number"
                      value={form.settings.timeLimit || ""}
                      onChange={(e) =>
                        handleSettingsChange(
                          "timeLimit",
                          e.target.value ? parseInt(e.target.value) : null
                        )
                      }
                      className="input-field"
                      placeholder="No limit"
                      min="1"
                    />
                  </div>
                </div>
              </div>

              {/* Form Stats */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <BarChart3 size={20} />
                  <span>Form Stats</span>
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Questions</span>
                    <span className="font-semibold text-gray-900">
                      {form.questions.length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        form.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {form.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Created</span>
                    <span className="text-sm text-gray-900">
                      {id ? "Recently" : "New"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>

                <div className="space-y-2">
                  <button className="w-full btn-secondary text-left flex items-center space-x-2">
                    <Share2 size={16} />
                    <span>Share Form</span>
                  </button>

                  <button className="w-full btn-secondary text-left flex items-center space-x-2">
                    <Download size={16} />
                    <span>Export Responses</span>
                  </button>

                  <button className="w-full btn-secondary text-left flex items-center space-x-2">
                    <Users size={16} />
                    <span>View Responses</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
