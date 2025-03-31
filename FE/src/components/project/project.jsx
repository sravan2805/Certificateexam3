import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ name: '', description: '' }); // Removed members
  const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '' });
  const [userId, setUserId] = useState(null);

  const baseURL = 'http://localhost:5000/api'; // Backend URL

  // Get userId from localStorage when component loads
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.error('No userId found in localStorage');
    }
  }, []);

  // Fetch all projects for the logged-in user
  const fetchProjects = async () => {
    if (!userId) {
      console.error('No userId available');
      return;
    }
    try {
      const response = await axios.get(`${baseURL}/projects?userId=${userId}`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error.response?.data?.message || error.message);
    }
  };

  // Add a new project
  const addProject = async () => {
    if (!newProject.name.trim() || !newProject.description.trim()) {
      console.error('❌ Project name and description required');
      return;
    }

    try {
      const response = await axios.post(`${baseURL}/projects`, {
        name: newProject.name,
        description: newProject.description,
        createdBy: userId, // Pass only name, description, and createdBy
      });

      console.log('✅ Project added:', response.data);
      setNewProject({ name: '', description: '' });
      alert('Project added successfully!');
      fetchProjects();
    } catch (error) {
      console.error('🔥 Error adding project:', error.response?.data?.error || error.message);
    }
  };

  // Edit a project
  const editProject = async (projectId) => {
    const updatedName = prompt('Edit Project Name:');
    const updatedDescription = prompt('Edit Project Description:');
    if (!updatedName || !updatedDescription) return;
    try {
      await axios.put(`${baseURL}/projects/${projectId}`, {
        name: updatedName,
        description: updatedDescription,
      });
      fetchProjects();
    } catch (error) {
      console.error('Error updating project:', error.response?.data?.message || error.message);
    }
  };

  // Delete a project
  const deleteProject = async (projectId) => {
    try {
      await axios.delete(`${baseURL}/projects/${projectId}`);
      setProjects((prevProjects) => prevProjects.filter((project) => project._id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error.response?.data?.message || error.message);
    }
  };

  // Add a task to a project
  const addTask = async (projectId) => {
    if (!newTask.title.trim() || !newTask.description.trim()) return;
    try {
      await axios.post(`${baseURL}/projects/${projectId}/tasks`, newTask);
      setNewTask({ title: '', description: '', assignedTo: '' });
      alert('Task added successfully!');
      fetchProjects(); // Refresh projects after adding task
    } catch (error) {
      console.error('Error adding task:', error.response?.data?.message || error.message);
    }
  };

  // Edit a task
  const editTask = async (projectId, taskId) => {
    const updatedTitle = prompt('Edit Task Title:');
    const updatedDescription = prompt('Edit Task Description:');
    if (!updatedTitle || !updatedDescription) return;
    try {
      await axios.put(`${baseURL}/projects/${projectId}/tasks/${taskId}`, {
        title: updatedTitle,
        description: updatedDescription,
      });
      fetchProjects(); // Refresh projects after task update
    } catch (error) {
      console.error('Error updating task:', error.response?.data?.message || error.message);
    }
  };

  // Delete a task
  const deleteTask = async (projectId, taskId) => {
    try {
      await axios.delete(`${baseURL}/projects/${projectId}/tasks/${taskId}`);
      fetchProjects(); // Refresh after deleting task
    } catch (error) {
      console.error('Error deleting task:', error.response?.data?.message || error.message);
    }
  };

  // Fetch projects when userId is available
  useEffect(() => {
    if (userId) {
      fetchProjects();
    }
  }, [userId]);

  return (
    <div>
      <h2>My Projects</h2>

      {/* Add Project */}
      <div>
        <input
          type="text"
          placeholder="Project Name"
          value={newProject.name}
          onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Project Description"
          value={newProject.description}
          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
        />
        <button onClick={addProject}>Add Project</button>
      </div>

      {/* Project List */}
      <ul>
        {projects.length === 0 ? (
          <p>No projects available. Add a project to get started!</p>
        ) : (
          projects.map((project) => (
            <li key={project._id}>
              <div>
                <strong>{project.name}</strong> - {project.description}
              </div>
              <button onClick={() => editProject(project._id)}>Edit</button>
              <button onClick={() => deleteProject(project._id)}>Delete</button>

              {/* Add Task to Project */}
              <div>
                <input
                  type="text"
                  placeholder="Task Title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Task Description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
                <button onClick={() => addTask(project._id)}>Add Task</button>
              </div>

              {/* Task List */}
              <ul>
                {project.tasks.map((task) => (
                  <li key={task._id}>
                    <div>
                      {task.title} - {task.description}
                    </div>
                    <button onClick={() => editTask(project._id, task._id)}>Edit Task</button>
                    <button onClick={() => deleteTask(project._id, task._id)}>Delete Task</button>
                  </li>
                ))}
              </ul>
            </li>
          ))
        )}
      </ul>

      {/* Basic CSS for layout */}
      <style>
        {`
          div {
            margin-bottom: 10px;
          }
          ul {
            list-style-type: none;
            padding: 0;
          }
          li {
            margin-bottom: 10px;
            border: 1px solid #ccc;
            padding: 10px;
            border-radius: 5px;
            background-color: #f9f9f9;
          }
          button {
            margin: 5px;
            padding: 5px 10px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }
          button:hover {
            background-color: #0056b3;
          }
          input {
            margin: 5px 0;
            padding: 8px;
            width: 200px;
          }
        `}
      </style>
    </div>
  );
};

export default Projects;
