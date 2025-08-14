import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import FormBuilder from "./pages/FormBuilder";
import FormPreview from "./pages/FormPreview";
import FormFill from "./pages/FormFill";
import Responses from "./pages/Responses";

function App() {
  return (
    <div className="min-h-screen app-bg">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/builder" element={<FormBuilder />} />
          <Route path="/builder/:id" element={<FormBuilder />} />
          <Route path="/preview/:id" element={<FormPreview />} />
          <Route path="/fill/:id" element={<FormFill />} />
          <Route path="/responses/:id" element={<Responses />} />
        </Routes>
      </main>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
