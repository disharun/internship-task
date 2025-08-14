import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Eye, Calendar, User } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const Responses = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [formResponse, responsesResponse] = await Promise.all([
        axios.get(`/api/forms/${id}`),
        axios.get(`/api/responses/form/${id}`),
      ]);

      setForm(formResponse.data);
      setResponses(responsesResponse.data);
    } catch (error) {
      toast.error("Failed to fetch data");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const exportResponses = () => {
    if (responses.length === 0) {
      toast.error("No responses to export");
      return;
    }

    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";

    // Add headers
    const headers = ["Response ID", "Submitted At", "User Info"];
    form.questions?.forEach((question, index) => {
      headers.push(`Q${index + 1}: ${question.question}`);
    });
    csvContent += headers.join(",") + "\n";

    // Add data rows
    responses.forEach((response) => {
      const row = [
        response._id,
        new Date(response.submittedAt).toLocaleString(),
        response.userInfo?.name || response.userInfo?.email || "Anonymous",
      ];

      form.questions?.forEach((question, index) => {
        const answer = response.answers.find(
          (a) => a.questionId === index.toString()
        );
        if (answer) {
          switch (question.type) {
            case "categorize":
              row.push(JSON.stringify(answer.answer));
              break;
            case "cloze":
              row.push(JSON.stringify(answer.answer));
              break;
            case "comprehension":
              row.push(JSON.stringify(answer.answer));
              break;
            default:
              row.push(answer.answer || "");
          }
        } else {
          row.push("");
        }
      });

      csvContent += row.join(",") + "\n";
    });

    // Download CSV
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${form.title}_responses.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Responses exported successfully!");
  };

  const formatAnswer = (answer, questionType) => {
    if (!answer) return "No answer";

    switch (questionType) {
      case "categorize":
        return Object.entries(answer)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ");
      case "cloze":
        return Object.entries(answer)
          .map(([key, value]) => `Blank ${key}: ${value}`)
          .join(", ");
      case "comprehension":
        return Object.entries(answer)
          .map(([key, value]) => `Q${key}: ${value}`)
          .join(", ");
      default:
        return JSON.stringify(answer);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Form Responses</h1>
            <p className="text-gray-600 mt-1">
              View responses for "{form.title}"
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={exportResponses}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Response Summary */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {responses.length}
          </div>
          <div className="text-gray-600">Total Responses</div>
        </div>

        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {form.questions?.length || 0}
          </div>
          <div className="text-gray-600">Questions</div>
        </div>

        <div className="card text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {form.isPublished ? "Live" : "Draft"}
          </div>
          <div className="text-gray-600">Status</div>
        </div>
      </div>

      {responses.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No responses yet
          </h3>
          <p className="text-gray-600 mb-6">
            Share your form link to start collecting responses
          </p>
          <button
            onClick={() => {
              const link = `${window.location.origin}/fill/${id}`;
              navigator.clipboard.writeText(link);
              toast.success("Form link copied to clipboard!");
            }}
            className="btn-primary"
          >
            Copy Form Link
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Responses List */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              All Responses
            </h3>
            <div className="space-y-4">
              {responses.map((response, index) => (
                <div
                  key={response._id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedResponse(response)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 text-primary-800 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          Response #{index + 1}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center space-x-2">
                          <Calendar size={14} />
                          <span>
                            {new Date(response.submittedAt).toLocaleString()}
                          </span>
                          {response.userInfo?.name && (
                            <>
                              <User size={14} />
                              <span>{response.userInfo.name}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <button className="text-primary-600 hover:text-primary-700">
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Response Detail Modal */}
          {selectedResponse && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Response Details
                    </h3>
                    <button
                      onClick={() => setSelectedResponse(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ArrowLeft size={20} />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Response ID
                      </label>
                      <p className="text-sm text-gray-900 font-mono">
                        {selectedResponse._id}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Submitted At
                      </label>
                      <p className="text-sm text-gray-900">
                        {new Date(
                          selectedResponse.submittedAt
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Answers</h4>
                    {form.questions?.map((question, index) => {
                      const answer = selectedResponse.answers.find(
                        (a) => a.questionId === index.toString()
                      );
                      return (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="mb-3">
                            <span className="bg-primary-100 text-primary-800 text-sm font-medium px-2 py-1 rounded-full mr-2">
                              {index + 1}
                            </span>
                            <span className="font-medium text-gray-900">
                              {question.question}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            <strong>Answer:</strong>{" "}
                            {formatAnswer(answer?.answer, question.type)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Responses;
