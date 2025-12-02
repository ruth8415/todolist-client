import React, { useEffect, useState } from 'react';
import service from './service.js';

function App() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);

  async function getTodos() {
    const todos = await service.getTasks();
    setTodos(todos);
  }

  async function createTodo(e) {
    e.preventDefault();
    if (newTodo.trim()) {
      await service.addTask(newTodo);
      setNewTodo("");
      await getTodos();
    }
  }

  async function updateCompleted(todo, isComplete) {
    await service.setCompleted(todo.id, isComplete);
    await getTodos();
  }

  async function deleteTodo(id) {
    await service.deleteTask(id);
    await getTodos();
  }

  useEffect(() => {
    getTodos();
  }, []);

  // Get current date in Hebrew
  const today = new Date();
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const hebrewDate = today.toLocaleDateString('he-IL', dateOptions);

  // Calculate progress
  const completedCount = todos.filter(t => t.isComplete).length;
  const totalCount = todos.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <section className="todoapp">
      <header className="header">
        <h1>המשימות שלי</h1>
        <p className="date-display">{hebrewDate}</p>
        
        <form onSubmit={createTodo} className="input-container">
          <input 
            className="new-todo" 
            placeholder="הוסיפי משימה חדשה..." 
            value={newTodo} 
            onChange={(e) => setNewTodo(e.target.value)} 
          />
          <button type="submit" className="add-btn">
            + הוסיפי
          </button>
        </form>
      </header>

      <section className="main">
        {todos.length === 0 ? (
          <div className="empty-state">
            <p>אין משימות עדיין. התחילי להוסיף!</p>
          </div>
        ) : (
          <ul className="todo-list">
            {todos.map(todo => (
              <li className={todo.isComplete ? "completed" : ""} key={todo.id}>
                <div className="view">
                  <input 
                    className="toggle" 
                    type="checkbox" 
                    checked={todo.isComplete} 
                    onChange={(e) => updateCompleted(todo, e.target.checked)} 
                  />
                  <label>{todo.name}</label>
                  <button className="destroy" onClick={() => deleteTodo(todo.id)}></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {todos.length > 0 && (
        <>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <div className="stats">
            <span>{completedCount} מתוך {totalCount} הושלמו</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
        </>
      )}
    </section>
  );
}

export default App;