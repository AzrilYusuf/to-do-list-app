import { useState } from "react";

const ToDoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ task: "", deadline: "" });

  // Handle both text and date input
  const handleInputChange = (e) => {
    setNewTask((t) => ({ ...t, [e.target.name]: e.target.value }));
  };

  const addTask = () => {
    if (newTask.task.trim() !== "" && newTask.deadline.trim() !== "") {
      setTasks((t) => [...t, newTask]);
      setNewTask(""); // To clear input element after click add task button
    }
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const moveTaskUp = (index) => {
    if (index > 0) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index - 1]] = [
        updatedTasks[index - 1],
        updatedTasks[index],
      ];
      setTasks(updatedTasks);
    }
  };

  const moveTaskDown = (index) => {
    if (index < tasks.length - 1) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index + 1]] = [
        updatedTasks[index + 1],
        updatedTasks[index],
      ];
      setTasks(updatedTasks);
    }
  };

  return (
    <div className="to-do-list">
      <h1>To Do List</h1>
      <div className="new-task">
        <input
          type="text"
          placeholder="Enter a task..."
          name="task"
          value={newTask.task}
          onChange={(e) => handleInputChange(e)}
        />
        <input
          type="date"
          name="deadline"
          value={newTask.deadline}
          onChange={(e) => handleInputChange(e)}
        />
        <button className="add-button" onClick={addTask}>
          Add Task
        </button>
      </div>
      <ol>
        {tasks.map((task, index) => (
          <li key={index}>
            <span className="text">{task.task}</span>
            <span className="deadline">{task.deadline}</span>
            <div className="button-task-container">
              <button
                className="delete-button"
                onClick={() => deleteTask(index)}
              >
                Delete
              </button>
              <button className="move-button" onClick={() => moveTaskUp(index)}>
                Up
              </button>
              <button
                className="move-button"
                onClick={() => moveTaskDown(index)}
              >
                Down
              </button>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ToDoList;
