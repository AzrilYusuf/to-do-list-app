import { useState, useEffect } from "react";
import DateTime from "./components/DateTime";

const ToDoList = () => {
  // This is where the task is stored
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [newTask, setNewTask] = useState({
    taskMessage: "",
    deadline: "",
    createdAt: "",
    isComplete: false,
  });

  // Load tasks from local storage when the component mounts
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to local storage whenever tasks state changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Handle both text and date input
  const handleInputChange = (e) => {
    setNewTask((t) => ({
      ...t,
      [e.target.name]: e.target.value,
    }));
  };

  const addTask = () => {
    if (newTask.taskMessage.trim() !== "" && newTask.deadline.trim() !== "") {
      const currentDate = new Date();
      // Convert the newTask.deadline into Date() object before converting into dd/mm/yyyy
      const deadlineDate = new Date(newTask.deadline);
      const formattedDeadline = formatDate(deadlineDate); // To convert the deadline date into dd/mm/yyy
      const createdAt = formatDate(currentDate); // Automatically create the date when adding new task

      setTasks((t) => [
        ...t,
        { ...newTask, deadline: formattedDeadline, createdAt: createdAt },
      ]);
      // To clear input element after click add task button
      setNewTask({
        taskMessage: "",
        deadline: "",
        createdAt: "",
        isComplete: false,
      });
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

  // To format the date into dd/mm/yyyy
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0"); // Get day and pad with leading 0 if necessary
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month (0-indexed, so +1) and pad
    const year = date.getFullYear(); // Get the full year (e.g., 2024)

    return `${day}-${month}-${year}`; // Return the date in dd/mm/yyyy format
  };

  return (
    <div className="to-do-list">
      <h1>To Do List</h1>
      <DateTime />
      <div className="new-task">
        <input
          type="text"
          placeholder="Enter a task..."
          name="taskMessage"
          value={newTask.taskMessage}
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
      <div className="undone-tasks">
        <ol>
          {tasks.map((task, index) => (
            <li key={index}>
              <input 
              type="checkbox"
              checked={}
              onChange={}
               />
              <span className="text">{task.taskMessage}</span>
              <span className="deadline">Deadline: {task.deadline}</span>
              <span className="deadline">Created task: {task.createdAt}</span>
              <div className="button-task-container">
                <button
                  className="delete-button"
                  onClick={() => deleteTask(index)}
                >
                  Delete
                </button>
                <button
                  className="move-button"
                  onClick={() => moveTaskUp(index)}
                >
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
      {/* <div className="done-tasks">
        <ol>
          {tasks.map((task, index) => (
            <li key={index}>
              <span className="text">{task.taskMessage}</span>
              <span className="deadline">Deadline: {task.deadline}</span>
              <span className="deadline">Created task: {task.createdAt}</span>
              <div className="button-task-container">
                <button
                  className="delete-button"
                  onClick={() => deleteTask(index)}
                >
                  Delete
                </button>
                <button
                  className="move-button"
                  onClick={() => moveTaskUp(index)}
                >
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
      </div> */}
    </div>
  );
};

export default ToDoList;
