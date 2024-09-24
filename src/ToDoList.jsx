import { useState, useEffect } from "react";
import DateTime from "./components/DateTime";
import Swal from "sweetalert2";
import "bootstrap-icons/font/bootstrap-icons.css";

const ToDoList = () => {
  // This is where the profile is stored
  const [profile, setProfile] = useState(() => {
    // Load profile from local storage if exists
    const savedProfile = localStorage.getItem("profile");
    return savedProfile ? JSON.parse(savedProfile) : { username: "", job: "" };
  });

  const [isAddingTask, setIsAddingTask] = useState(false);
  // Toggle task input expansion
  const toggleTaskInput = () => {
    setIsAddingTask((prev) => !prev);
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Delete all data
  const deleteAllTask = () => {
    const tasks = [];
    if (tasks) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Deleted!",
            text: "Your tasks have been deleted.",
            icon: "success",
          });
          setTasks(tasks);
        }
      });
    }
  };

  // To format the date into dd/mm/yyyy
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`; // Return the date in dd/mm/yyyy format
  };

  return (
    <>
      <header>
        <div className="profile">
          <h3 className="username">{profile.username}</h3>
          <hr />
          <p className="user-job">{profile.job}</p>
          <div className="edit-profile" onClick={editProfile}>
            <i className="bi bi-pencil-square" />
          </div>
        </div>
        <h2>Create your own task</h2>
        <DateTime />
      </header>
      <div className="container">
        {!isAddingTask ? (
          <div className="new-task">
            <button className="add-button" onClick={toggleTaskInput}>
              Add Task
            </button>
          </div>
        ) : (
          <div className={`new-task ${isAddingTask ? "expanded" : ""}`}>
            <button className="hide-button" onClick={toggleTaskInput}>
              Hide
            </button>
            <div className="task-input-container">
              <textarea
                placeholder="Enter a task..."
                name="taskMessage"
                value={newTask.taskMessage}
                onChange={(e) => handleInputChange(e)}
                className="task-textarea"
              />
              <input
                type="date"
                name="deadline"
                className="date-input"
                value={newTask.deadline}
                onChange={(e) => handleInputChange(e)}
              />
              <button className="save-task-button" onClick={addTask}>
                Save Task
              </button>
            </div>
          </div>
        )}

        <div className="undone-tasks">
          <h3 className="status-tasks">To-do List</h3>
          {tasks != false ? (
            <ol>
              {tasks.map((task, index) =>
                task.isComplete === false ? (
                  <li key={index}>
                    <input
                      type="checkbox"
                      className="task-checkbox"
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
                    <span className="deadline">
                      Created task: {task.createdAt}
                    </span>
                    <span className="deadline">Deadline: {task.deadline}</span>
                    <div className="button-task-container">
                      <button
                        className="delete-button"
                        onClick={() => deleteTask(index)}
                      >
                        <i className="bi bi-trash" />
                      </button>
                      <button
                        className="move-button"
                        onClick={() => moveTaskUp(index)}
                      >
                        <i className="bi bi-caret-up" />
                      </button>
                      <button
                        className="move-button"
                        onClick={() => moveTaskDown(index)}
                      >
                        <i className="bi bi-caret-down" />
                      </button>
                    </div>
                  </li>
                ) : null
              )}
            </ol>
          ) : (
            <div className="info">
              You do not have any task yet, click Add Task button to create a
              new task
            </div>
          )}
        </div>
        <div className="done-tasks">
          <h3 className="status-tasks">Completed Task</h3>
          {tasks != false ? (
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
                    <span className="deadline">
                      Created task: {task.createdAt}
                    </span>
                    <span className="deadline">Deadline: {task.deadline}</span>
                    <div className="button-task-container">
                      <button
                        className="delete-button"
                        onClick={() => deleteTask(index)}
                      >
                        <i className="bi bi-trash" />
                      </button>
                      <button
                        className="move-button"
                        onClick={() => moveTaskUp(index)}
                      >
                        <i className="bi bi-caret-up" />
                      </button>
                      <button
                        className="move-button"
                        onClick={() => moveTaskDown(index)}
                      >
                        <i className="bi bi-caret-down" />
                      </button>
                    </div>
                  </li>
                ) : null
              )}
            </ol>
          ) : (
            <div className="info">You have not completed any task yet</div>
          )}
        </div>

        <button className="delete-all" onClick={() => deleteAllTask()}>
          Delete All
        </button>
        <footer>
          <i className="bi bi-info-circle-fill" /> Adjust your task list based
          on the priority with <i className="bi bi-caret-up" /> and{" "}
          <i className="bi bi-caret-down" /> button
        </footer>
      </div>
    </>
  );
};

export default ToDoList;
