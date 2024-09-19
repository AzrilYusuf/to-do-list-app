import { useState, useEffect } from "react";
import DateTime from "./components/DateTime";
import Swal from "sweetalert2";

const ToDoList = () => {
  // This is where the profile is stored
  const [profile, setProfile] = useState(() => {
    // Load profile from local storage if exists
    const savedProfile = localStorage.getItem("profile");
    return savedProfile ? JSON.parse(savedProfile) : { username: "", job: "" };
  });
  
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

  // This will triggers the profile pop-up on first load if profile is incomplete
  useEffect(() => {
    if (!profile.username || !profile.job) {
      editProfile();
    }
  }, [profile]);

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

  const editProfile = () => {
    Swal.fire({
      title: "Profile",
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Enter your name" value="${profile.username}">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Enter your job" value="${profile.job}">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Save",
      preConfirm: () => {
        const username = document.getElementById("swal-input1").value;
        const job = document.getElementById("swal-input2").value;
        if (!username || !job) {
          Swal.showValidationMessage("Please fill out both fields");
        }
        return { username, job };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { username, job } = result.value;
        setProfile({ username, job });
        // Save profile in local storage
        localStorage.setItem("profile", JSON.stringify({ username, job }));
      }
    });
  };

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

  // To handle checkbox
  const toggleTaskCompletion = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, isComplete: !task.isComplete } : task
    );
    setTasks(updatedTasks);
  };

  // To format the date into dd/mm/yyyy
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`; // Return the date in dd/mm/yyyy format
  };

  return (
    <div className="to-do-list">
      <header>
        <div className="profile">
          <h3 className="username">{profile.username}</h3>
          <p className="user-job">{profile.job}</p>
        </div>
        <div className="edit-profile" onClick={editProfile}>
          <i className="fa fa-edit" /> Edit
        </div>
        <h2>Create your own task</h2>
        <DateTime />
      </header>
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
          {tasks.map((task, index) =>
            task.isComplete === false ? (
              <li key={index}>
                <input
                  type="checkbox"
                  className={"task-checkbox"}
                  checked={task.isComplete}
                  onChange={() => toggleTaskCompletion(index)}
                />
                <span
                  className={`text ${
                    task.isComplete === true ? "completed" : ""
                  }`}
                >
                  {task.taskMessage}
                </span>
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
            ) : null
          )}
        </ol>
      </div>
      <div className="done-tasks">
        <ol>
          {tasks.map((task, index) =>
            task.isComplete === true ? (
              <li key={index}>
                <input
                  type="checkbox"
                  className={"task-checkbox"}
                  checked={task.isComplete}
                  onChange={() => toggleTaskCompletion(index)}
                />
                <span
                  className={`text ${
                    task.isComplete === true ? "completed" : ""
                  }`}
                >
                  {task.taskMessage}
                </span>
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
            ) : null
          )}
        </ol>
      </div>
    </div>
  );
};

export default ToDoList;
