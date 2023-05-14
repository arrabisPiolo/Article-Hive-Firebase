import "./home.scss";
import { useState, useEffect } from "react";
import { SampleData, getDocsData } from "../../utils/firebase/firebase.utils";

function Home() {
  const [newItem, setNewItem] = useState("");
  const [todos, setTodos] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newItem.trim() === "") {
      alert("Please enter a todo item.");
      return;
    }
    setTodos((currentTodos) => {
      return [
        ...currentTodos,
        { id: crypto.randomUUID(), title: newItem, completed: false },
      ];
    });
    setNewItem("");
  };
  const handleDelete = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // useEffect(() => {
  //   async function fetchSampleData() {
  //     await SampleData();
  //   }
  //   fetchSampleData();
  // }, []);

  console.log(todos);
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="container">
          <input
            value={newItem}
            type="text"
            placeholder="Type"
            onChange={(e) => {
              setNewItem(e.target.value);
            }}
          />
          <button>ADD ITEM</button>
        </div>
      </form>
      <div className="list-container">
        <h1>TO DO LIST</h1>
        <ul>
          {todos.map((todo) => {
            return (
              <li key={todo.id}>
                {todo.title}
                <button
                  className="delete"
                  onClick={() => handleDelete(todo.id)}
                >
                  Delete
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default Home;
