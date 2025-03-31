import express from 'express';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  addTask,
  updateTask,
  deleteTask
} from '../controllers/projectControllers.js';

const router = express.Router();

// Routes
router.get('/projects', getProjects);
router.post('/projects', createProject);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);
router.post('/projects/:id/tasks', addTask);
router.put('/projects/:id/tasks/:taskId', updateTask);
router.delete('/projects/:id/tasks/:taskId', deleteTask);

export default router;
