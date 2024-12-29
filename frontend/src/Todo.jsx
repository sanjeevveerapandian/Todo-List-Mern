import { useEffect, useState } from "react";

export default function Todo() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState();
  const [message, setMessage] = useState();
  const [editId, setEditId] = useState(-1);

  // Edit states
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

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
          setMessage("Item updated successfully");
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
          setMessage("Item deleted successfully");
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
    setEditTitle(item.title); // Initialize with the current item's title
    setEditDescription(item.description); // Initialize with the current item's description
  };

  return (
    <>
      <div className="row p-3 bg-success text-light">
        <h1>Todo project with MERN Stack</h1>
      </div>
      <div className="row mt-3">
        <h3>Tasks</h3>
        {message && <p className="text-success">{message}</p>}
        {error && <p className="text-danger">{error}</p>}
        <ul className="list-group">
          {todos.map((item) => (
            <li
              key={item._id}
              className="list-group-item bg-info d-flex justify-content-between align-items-center my-2"
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
                    <span>{item.description}</span>
                  </>
                )}
              </div>

              <div className="d-flex gap-2">
                {editId === item._id ? (
                  <button
                    className="btn btn-success"
                    onClick={handleUpdate}
                  >
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
    </>
  );
}
