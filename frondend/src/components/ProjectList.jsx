import { useEffect, useState } from "react";
import axios from "../axios";
import ProjectForm from "./ProjectForm";

function EditModal({ project, onClose, onSubmit }) {
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [priority, setPriority] = useState(project.priority);
  const [status, setStatus] = useState(project.status);
  const [dueDate, setDueDate] = useState(project.due_date);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id: project.id,
      title,
      description,
      priority,
      status,
      due_date: dueDate,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Project</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full p-2 border rounded"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full p-2 border rounded"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="inprogress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProjectList({ role }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [editProject, setEditProject] = useState(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterPriority) params.priority = filterPriority;
      if (filterStatus) params.status = filterStatus;
      if (filterDate) params.due_date = filterDate;

      // ✅ Corrected URL
      const res = await axios.get("mini-projects/", { params });
      setProjects(res.data);
    } catch (err) {
      console.error(err.response || err.message);
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [filterPriority, filterStatus, filterDate]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await axios.delete(`mini-projects/${id}/`);
      setProjects(projects.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err.response || err.message);
      alert("Failed to delete project");
    }
  };

  const handleUpdateStatus = async (id) => {
    try {
      await axios.patch(`mini-projects/${id}/`, { status: "completed" });
      setProjects(
        projects.map((p) => (p.id === id ? { ...p, status: "completed" } : p))
      );
    } catch (err) {
      console.error(err.response || err.message);
      alert("Failed to update project");
    }
  };

  const handleEditSubmit = async (updatedProject) => {
    try {
      await axios.put(`mini-projects/${updatedProject.id}/`, updatedProject);
      setProjects(
        projects.map((p) => (p.id === updatedProject.id ? updatedProject : p))
      );
      setEditProject(null);
    } catch (err) {
      console.error(err.response || err.message);
      alert("Failed to update project");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading projects...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      {role === "trainer" && <ProjectForm onSuccess={fetchProjects} />}

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <select
          onChange={(e) => setFilterPriority(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Status</option>
          <option value="inprogress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <input
          type="date"
          onChange={(e) => setFilterDate(e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      {/* Project list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((p) => (
          <div
            key={p.id}
            className="bg-white p-4 rounded shadow hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold">{p.title}</h3>
            <p className="text-gray-600">{p.description}</p>
            <p className="mt-2">
              <span className="font-bold">Priority:</span> {p.priority}
            </p>
            <p>
              <span className="font-bold">Status:</span> {p.status}
            </p>
            <p>
              <span className="font-bold">Due Date:</span> {p.due_date}
            </p>

            {role === "trainee" && p.status !== "completed" && (
              <button
                onClick={() => handleUpdateStatus(p.id)}
                className="mt-2 bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
              >
                Mark as Complete
              </button>
            )}

            {role === "trainer" && (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setEditProject(p)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {editProject && (
        <EditModal
          project={editProject}
          onClose={() => setEditProject(null)}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
}
