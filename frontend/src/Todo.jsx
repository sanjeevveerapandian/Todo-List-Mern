import { useEffect, useState } from "react";

export default function Todo() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState();
  const [message, setMessage] = useState();
  const [editId, setEditId] = useState(-1);

  // Edit states
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // New Task States
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const apiurl = "http://localhost:8000";

  const getItems = () => {
    fetch(apiurl + "/todos")
      .then((res) => res.json())
      .then((data) => {
        setTodos(data);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch tasks.");
      });
  };

  useEffect(() => {
    getItems();
  }, []);

  const handleAdd = () => {
    if (newTitle.trim() !== "" && newDescription.trim() !== "") {
      fetch(apiurl + "/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTitle, description: newDescription }),
      })
        .then((res) => res.json())
        .then((newTodo) => {
          setTodos((prevTodos) => [...prevTodos, newTodo]);
          setNewTitle("");
          setNewDescription("");
          setMessage("Task added successfully!");
          setTimeout(() => {
            setMessage("");
          }, 4000);
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to add the task.");
        });
    }
  };

  const handleUpdate = () => {
    if (editTitle.trim() !== "" && editDescription.trim() !== "") {
      fetch(`${apiurl}/todos/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      })
        .then((res) => res.json())
        .then((updatedTodo) => {
          setTodos((prevTodos) =>
            prevTodos.map((todo) =>
              todo._id === editId ? updatedTodo : todo
            )
          );
          setEditId(-1);
          setMessage("Task updated successfully!");
          setTimeout(() => {
            setMessage("");
          }, 4000);
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to update the task.");
        });
    }
  };

  const handleDelete = (id) => {
    fetch(`${apiurl}/todos/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
          setMessage("Task deleted successfully!");
          setTimeout(() => {
            setMessage("");
          }, 4000);
        } else {
          throw new Error("Failed to delete the task.");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to delete the task.");
      });
  };

  const startEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col text-center">
          <h1 className="text-primary">Todo App</h1>
          <p className="text-muted">Manage your tasks efficiently</p>
        </div>
      </div>

      {/* Add New Task Section */}
      <div className="row mb-4">
        <div className="col">
          <h3>Add a Task</h3>
          <div className="d-flex gap-2">
            <input
              placeholder="Task Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="form-control"
            />
            <input
              placeholder="Task Description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="form-control"
            />
            <button className="btn btn-primary" onClick={handleAdd}>
              Add Task
            </button>
          </div>
        </div>
      </div>

      {/* Task List Section */}
      <div className="row mb-4">
        <div className="col">
          <h3>Tasks</h3>
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <ul className="list-group">
            {todos.map((item) => (
              <li
                key={item._id}
                className="list-group-item d-flex justify-content-between align-items-center mb-2 border shadow-sm"
              >
                <div className="d-flex flex-column">
                  {editId === item._id ? (
                    <div className="form-group d-flex gap-2">
                      <input
                        placeholder="Title"
                        onChange={(e) => setEditTitle(e.target.value)}
                        value={editTitle}
                        className="form-control"
                        type="text"
                      />
                      <input
                        placeholder="Description"
                        onChange={(e) => setEditDescription(e.target.value)}
                        value={editDescription}
                        className="form-control"
                        type="text"
                      />
                    </div>
                  ) : (
                    <>
                      <span className="fw-bold">{item.title}</span>
                      <span className="text-muted">{item.description}</span>
                    </>
                  )}
                </div>

                <div className="d-flex gap-2">
                  {editId === item._id ? (
                    <button className="btn btn-success" onClick={handleUpdate}>
                      Update
                    </button>
                  ) : (
                    <button
                      className="btn btn-warning"
                      onClick={() => startEdit(item)}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
