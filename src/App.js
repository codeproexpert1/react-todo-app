import React, { useState, useEffect } from 'react';
import './App.css';


function App() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (inputValue.trim() === '') return;
    
    const newTask = {
      id: Date.now(),
      text: inputValue,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    setTasks([...tasks, newTask]);
    setInputValue('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const editTask = (id, newText) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, text: newText } : task
    ));
  };

  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const stats = {
    total: tasks.length,
    active: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>📝 React Todo App</h1>
          <p>Organize your tasks efficiently</p>
        </header>

        <div className="input-section">
          <input
            type="text"
            className="task-input"
            placeholder="What needs to be done?"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
          />
          <button className="add-btn" onClick={addTask}>
            Add Task
          </button>
        </div>

        <div className="stats">
          <div className="stat-item">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.active}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.completed}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>

        <div className="filter-section">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        <div className="tasks-list">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <p>No tasks {filter !== 'all' ? filter : 'yet'}! 🎉</p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onEdit={editTask}
              />
            ))
          )}
        </div>

        {stats.completed > 0 && (
          <button className="clear-btn" onClick={clearCompleted}>
            Clear Completed ({stats.completed})
          </button>
        )}
      </div>
    </div>
  );
}

function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.text);

  const handleEdit = () => {
    if (editValue.trim() === '') return;
    onEdit(task.id, editValue);
    setIsEditing(false);
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        className="task-checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
      />
      
      {isEditing ? (
        <input
          type="text"
          className="edit-input"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleEdit()}
          onBlur={handleEdit}
          autoFocus
        />
      ) : (
        <span className="task-text" onClick={() => !task.completed && setIsEditing(true)}>
          {task.text}
        </span>
      )}

      <div className="task-actions">
        {!isEditing && !task.completed && (
          <button className="edit-btn" onClick={() => setIsEditing(true)}>
            ✏️
          </button>
        )}
        <button className="delete-btn" onClick={() => onDelete(task.id)}>
          🗑️
        </button>
      </div>
    </div>
  );
}

export default App;