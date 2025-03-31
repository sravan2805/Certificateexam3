import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './project.css'; // ✅ Import external CSS

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
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
        createdBy: userId,
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
    if (!newTask.title.trim() || !newTask.description.trim()) {
      console.error('❌ Task title and description are required');
      return;
    }

    const taskData = {
      title: newTask.title,
      description: newTask.description,
    };

    if (newTask.assignedTo.trim()) {
      taskData.assignedTo = newTask.assignedTo;
    }

    try {
      console.log('📡 Sending task to backend...');
      console.log('📦 Task data:', taskData);

      const response = await axios.post(`${baseURL}/projects/${projectId}/tasks`, taskData);
      console.log('✅ Task added:', response.data);

      setNewTask({ title: '', description: '', assignedTo: '' });
      alert('Task added successfully!');
      fetchProjects();
    } catch (error) {
      console.error('🔥 Error adding task:', error.response?.data?.error || error.message);
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
      fetchProjects();
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
    <div className="projects-container">
      <h2 className="section-title">My Projects</h2>

      {/* Add Project Section */}
      <div className="add-project">
        <input
          type="text"
          placeholder="Project Name"
          value={newProject.name}
          onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Project Description"
          value={newProject.description}
          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
          className="input-field"
        />
        <button onClick={addProject} className="add-btn">
          Add Project
        </button>
      </div>

      {/* Project List */}
      <ul className="project-grid">
        {projects.length === 0 ? (
          <p className="no-projects">No projects available. Add a project to get started!</p>
        ) : (
          projects.map((project) => (
            <li key={project._id} className="project-card">
              <div className="project-content">
                <strong className="project-title">{project.name}</strong>
                <p className="project-description">{project.description}</p>
              </div>
              <div className="button-group">
                <button className="edit-btn" onClick={() => editProject(project._id)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => deleteProject(project._id)}>
                  Delete
                </button>
              </div>

              {/* Add Task Section */}
              <div className="add-task">
                <input
                  type="text"
                  placeholder="Task Title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="Task Description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="input-field"
                />
                <button onClick={() => addTask(project._id)} className="add-btn">
                  Add Task
                </button>
              </div>

              {/* Task List */}
              <ul className="task-list">
                {project.tasks.map((task) => (
                  <li key={task._id} className="task-card">
                    <div>
                      <strong className="task-title">{task.title}</strong> -{' '}
                      <span className="task-desc">{task.description}</span>
                    </div>
                    <div className="button-group">
                      <button className="edit-btn" onClick={() => editTask(project._id, task._id)}>
                        Edit Task
                      </button>
                      <button className="delete-btn" onClick={() => deleteTask(project._id, task._id)}>
                        Delete Task
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Projects;
