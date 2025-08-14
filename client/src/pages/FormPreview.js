import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, Share2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const FormPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForm();
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

  const copyFormLink = () => {
    const link = `${window.location.origin}/fill/${id}`;
    navigator.clipboard.writeText(link);
    toast.success("Form link copied to clipboard!");
  };

  const renderQuestion = (question, index) => {
    switch (question.type) {
      case "categorize":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {question.categories?.map((category, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-200 min-h-[100px]"
                >
                  <h4 className="font-medium text-gray-900 mb-3">{category}</h4>
                  <div className="space-y-2">
                    {question.options
                      ?.filter((opt) => opt.category === category)
                      .map((option, optIdx) => (
                        <div
                          key={optIdx}
                          className="bg-white p-2 rounded border text-sm"
                        >
                          {option.text}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "cloze":
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed">
                {question.passage?.split("___").map((part, idx) => (
                  <span key={idx}>
                    {part}
                    {idx < question.passage.split("___").length - 1 && (
                      <span className="inline-block w-24 h-8 bg-white border-2 border-dashed border-gray-300 rounded mx-2"></span>
                    )}
                  </span>
                ))}
              </p>
            </div>
          </div>
        );

      case "comprehension":
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed">
                {question.passage}
              </p>
            </div>

            <div className="space-y-4">
              {question.comprehensionQuestions?.map((compQ, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <h4 className="font-medium text-gray-900 mb-3">
                    {idx + 1}. {compQ.question}
                  </h4>
                  <div className="space-y-2">
                    {compQ.options?.map((option, optIdx) => (
                      <div key={optIdx} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`comp-${index}-${idx}`}
                          className="text-primary-600 focus:ring-primary-500"
                          disabled
                        />
                        <span className="text-gray-700">{option}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!form) {
    return <div>Form not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Form Preview</h1>
            <p className="text-gray-600 mt-1">
              See how your form will appear to users
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={copyFormLink}
            className="btn-secondary flex items-center space-x-2"
          >
            <Share2 size={16} />
            <span>Copy Link</span>
          </button>
          <button
            onClick={() => navigate(`/fill/${id}`)}
            className="btn-primary flex items-center space-x-2"
          >
            <Eye size={16} />
            <span>Test Form</span>
          </button>
        </div>
      </div>

      {/* Form Preview */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        {form.headerImage && (
          <div className="w-full h-48 bg-gray-100">
            <img
              src={form.headerImage}
              alt="Header"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-8">
          {/* Form Title and Description */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {form.title}
            </h2>
            {form.description && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {form.description}
              </p>
            )}
          </div>

          {/* Questions */}
          <div className="space-y-8">
            {form.questions?.map((question, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-6"
              >
                <div className="flex items-start space-x-3 mb-4">
                  <span className="bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {question.question}
                      {question.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </h3>
                    {question.image && (
                      <img
                        src={question.image}
                        alt="Question"
                        className="max-w-md rounded-lg mb-4"
                      />
                    )}
                  </div>
                </div>

                {renderQuestion(question, index)}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="text-center pt-8 border-t border-gray-200">
            <button className="btn-primary px-8 py-3 text-lg">
              Submit Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormPreview;
