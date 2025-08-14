import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const FormFill = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchForm();
  }, [id]);

  const fetchForm = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/forms/${id}`);
      setForm(response.data);

      // Initialize answers object
      const initialAnswers = {};
      response.data.questions?.forEach((question, index) => {
        switch (question.type) {
          case "categorize":
            initialAnswers[index] = {};
            break;
          case "cloze":
            initialAnswers[index] = {};
            break;
          case "comprehension":
            initialAnswers[index] = {};
            break;
        }
      });
      setAnswers(initialAnswers);
    } catch (error) {
      toast.error("Failed to fetch form");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex, field, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: {
        ...prev[questionIndex],
        [field]: value,
      },
    }));

    // Clear error for this question
    if (errors[questionIndex]) {
      setErrors((prev) => ({
        ...prev,
        [questionIndex]: null,
      }));
    }
  };

  const validateAnswers = () => {
    const newErrors = {};

    form.questions?.forEach((question, index) => {
      if (question.required) {
        const answer = answers[index];

        switch (question.type) {
          case "categorize":
            if (!answer || Object.keys(answer).length === 0) {
              newErrors[index] = "Please categorize all items";
            }
            break;
          case "cloze":
            if (!answer || Object.keys(answer).length === 0) {
              newErrors[index] = "Please fill in all blanks";
            }
            break;
          case "comprehension":
            if (!answer || Object.keys(answer).length === 0) {
              newErrors[index] = "Please answer all questions";
            }
            break;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateAnswers()) {
      toast.error("Please fill in all required questions");
      return;
    }

    try {
      setSubmitting(true);

      const responseData = {
        formId: id,
        answers: Object.keys(answers).map((questionIndex) => ({
          questionId: questionIndex,
          questionType: form.questions[questionIndex].type,
          answer: answers[questionIndex],
        })),
      };

      await axios.post("/api/responses", responseData);
      toast.success("Form submitted successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to submit form");
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (question, index) => {
    switch (question.type) {
      case "categorize":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {question.categories?.map((category, catIdx) => (
                <div
                  key={catIdx}
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
            {errors[index] && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertCircle size={16} />
                <span>{errors[index]}</span>
              </div>
            )}
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
                      <input
                        type="text"
                        value={answers[index]?.[`blank-${idx}`] || ""}
                        onChange={(e) =>
                          handleAnswerChange(
                            index,
                            `blank-${idx}`,
                            e.target.value
                          )
                        }
                        className="inline-block w-24 h-8 bg-white border-2 border-gray-300 rounded mx-2 px-2 text-center focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Answer"
                      />
                    )}
                  </span>
                ))}
              </p>
            </div>
            {errors[index] && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertCircle size={16} />
                <span>{errors[index]}</span>
              </div>
            )}
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
              {question.comprehensionQuestions?.map((compQ, compIdx) => (
                <div
                  key={compIdx}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <h4 className="font-medium text-gray-900 mb-3">
                    {compIdx + 1}. {compQ.question}
                  </h4>
                  <div className="space-y-2">
                    {compQ.options?.map((option, optIdx) => (
                      <div key={optIdx} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`comp-${index}-${compIdx}`}
                          value={option}
                          checked={
                            answers[index]?.[`comp-${compIdx}`] === option
                          }
                          onChange={(e) =>
                            handleAnswerChange(
                              index,
                              `comp-${compIdx}`,
                              e.target.value
                            )
                          }
                          className="text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-gray-700">{option}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {errors[index] && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertCircle size={16} />
                <span>{errors[index]}</span>
              </div>
            )}
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

  if (!form.isPublished) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={32} className="text-yellow-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Form Not Available
        </h2>
        <p className="text-gray-600 mb-6">
          This form is not published yet and cannot be filled out.
        </p>
        <button onClick={() => navigate("/")} className="btn-primary">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Form Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{form.title}</h1>
        {form.description && (
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {form.description}
          </p>
        )}
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header Image */}
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
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary px-8 py-3 text-lg flex items-center space-x-2 mx-auto"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  <span>Submit Form</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormFill;
