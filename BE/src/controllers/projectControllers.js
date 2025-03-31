import mongoose from 'mongoose';
import { User, Project } from '../model/schema.js'; // ✅ Correct import

// Get all projects for the logged-in user
export const getProjects = async (req, res) => {
  const { userId } = req.query; // Get userId from query
  try {
    if (!userId) {
      return res.status(400).json({ error: 'UserId is required to fetch projects.' });
    }

    // ✅ Remove populate('members')
    const projects = await Project.find({ createdBy: userId }).populate('tasks.assignedTo');
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new project
export const createProject = async (req, res) => {
  const { name, description, createdBy } = req.body;

  try {
    console.log('🔎 Incoming Data:', req.body);

    // ✅ Validate required fields (no members)
    if (!name || !description || !createdBy) {
      console.error('❌ Missing required fields');
      return res.status(400).json({ error: 'Name, description, and createdBy are required.' });
    }

    // ✅ Create project without members
    const project = await Project.create({
      name,
      description,
      createdBy: new mongoose.Types.ObjectId(createdBy),
    });

    console.log('✅ Project created:', project);
    res.status(201).json(project);
  } catch (error) {
    console.error('🔥 Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project.' });
  }
};

// Update project details
export const updateProject = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedProject = await Project.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a project
export const deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProject = await Project.findByIdAndDelete(id);
    if (!deletedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add task to project

export const addTask = async (req, res) => {
  const { id } = req.params;
  let task = req.body;

  try {
    console.log('🔎 Received Task Data:', task);

    // Remove assignedTo if empty or invalid
    if (!task.assignedTo || task.assignedTo.trim() === '') {
      delete task.assignedTo;
    }

    const project = await Project.findById(id);
    if (!project) {
      console.error('❌ Project not found');
      return res.status(404).json({ error: 'Project not found' });
    }

    project.tasks.push(task);
    await project.save();
    console.log('✅ Task added successfully:', task);

    res.status(201).json({ message: 'Task added successfully', project });
  } catch (error) {
    console.error('🔥 Error adding task:', error.message);
    res.status(500).json({ error: error.message || 'Failed to add task' });
  }
};


// Update task details
export const updateTask = async (req, res) => {
  const { id, taskId } = req.params;
  try {
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const task = project.tasks.id(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    Object.assign(task, req.body);
    await project.save();
    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete task from project
export const deleteTask = async (req, res) => {
  const { id, taskId } = req.params;
  try {
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const task = project.tasks.id(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    task.deleteOne(); // ✅ Correctly remove task
    await project.save();
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
