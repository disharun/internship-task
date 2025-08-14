import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Eye, BarChart3, Copy, Trash2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await axios.get("/api/forms");
      setForms(response.data);
    } catch (error) {
      toast.error("Failed to fetch forms");
    } finally {
      setLoading(false);
    }
  };

  const deleteForm = async (id) => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      try {
        await axios.delete(`/api/forms/${id}`);
        toast.success("Form deleted successfully");
        fetchForms();
      } catch (error) {
        toast.error("Failed to delete form");
      }
    }
  };

  const copyFormLink = (id) => {
    const link = `${window.location.origin}/fill/${id}`;
    navigator.clipboard.writeText(link);
    toast.success("Form link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage your forms and view responses
          </p>
        </div>
        <Link to="/builder" className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Create New Form</span>
        </Link>
      </div>

      {forms.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No forms yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first form to get started
          </p>
          <Link to="/builder" className="btn-primary">
            Create Your First Form
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <div
              key={form._id}
              className="card hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {form.title}
                  </h3>
                  {form.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {form.description}
                    </p>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{form.questions?.length || 0} questions</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        form.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {form.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>
              </div>

              {form.headerImage && (
                <div className="mb-4">
                  <img
                    src={form.headerImage}
                    alt="Header"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/builder/${form._id}`}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Edit Form"
                  >
                    <Edit size={16} />
                  </Link>
                  <Link
                    to={`/preview/${form._id}`}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Preview Form"
                  >
                    <Eye size={16} />
                  </Link>
                  <Link
                    to={`/responses/${form._id}`}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="View Responses"
                  >
                    <BarChart3 size={16} />
                  </Link>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyFormLink(form._id)}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Copy Form Link"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={() => deleteForm(form._id)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Form"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
