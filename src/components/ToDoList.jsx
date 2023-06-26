import React from 'react';
import './index.css'

class TodoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      filteredTodos: [],
      searchTerm: '',
      sortOption: 'A-Z'
    };
  }

  addTodoItem = (event) => {
    event.preventDefault();
    const { todos, searchTerm } = this.state;
    const todoInput = event.target.elements['todo-input'];
    const todoText = todoInput.value.trim();
  
    if (todoText !== '') {
      const todo = {
        id: Date.now(),
        text: todoText,
        completed: false
      };
  
      const updatedTodos = [...todos, todo];
  
      this.setState({
        todos: updatedTodos
      });
  
      todoInput.value = '';
  
      if (searchTerm) {
        const filteredTodos = updatedTodos.filter((todo) =>
          todo.text.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.setState({ filteredTodos });
      } else {
        this.setState({ filteredTodos: updatedTodos });
      }
    }
  };
  

  toggleCompletionStatus = (todoId) => {
    this.setState((prevState) => {
      const updatedTodos = prevState.todos.map((todo) => {
        if (todo.id === todoId) {
          return {
            ...todo,
            completed: !todo.completed
          };
        }
        return todo;
      });
  
      return {
        todos: updatedTodos,
        filteredTodos: updatedTodos
      };
    }, this.renderTodoList);
  };
  
  editTodoItem = (todoId) => {
    const { todos } = this.state;
    const todoText = prompt(
      'Edit the to-do item:',
      todos.find((todo) => todo.id === todoId).text
    );

    if (todoText !== null) {
      this.setState((prevState) => ({
        todos: prevState.todos.map((todo) => {
          if (todo.id === todoId) {
            return {
              ...todo,
              text: todoText.trim()
            };
          }
          return todo;
        })
      }));
    }
  };

  deleteTodoItem = (todoId) => {
    this.setState((prevState) => ({
      todos: prevState.todos.filter((todo) => todo.id !== todoId)
    }));
  };

  filterTodoList = () => {
    const { todos, searchTerm } = this.state;
    const filteredTodos = todos.filter((todo) =>
      todo.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
    this.setState({ filteredTodos });
  };

  handleSearchInputChange = (event) => {
    const searchTerm = event.target.value.trim();
    this.setState({ searchTerm }, this.filterTodoList);
  };

  filterByTab = (tabId) => {
    const { todos } = this.state;
    let filteredTodos = [];

    if (tabId === 'all-tab') {
      filteredTodos = todos;
    } else if (tabId === 'active-tab') {
      filteredTodos = todos.filter((todo) => !todo.completed);
    } else if (tabId === 'completed-tab') {
      filteredTodos = todos.filter((todo) => todo.completed);
    }

    this.setState({ filteredTodos });
  };

  handleTabClick = (event) => {
    const tabId = event.target.id;
    this.filterByTab(tabId);
  };

  sortTodoList = () => {
    const { filteredTodos, sortOption } = this.state;
    let sortedTodos = [];

    if (sortOption === 'A-Z') {
      sortedTodos = filteredTodos.sort((a, b) => a.text.localeCompare(b.text));
    } else if (sortOption === 'Z-A') {
      sortedTodos = filteredTodos.sort((a, b) => b.text.localeCompare(a.text));
    } else if (sortOption === 'oldest') {
      sortedTodos = filteredTodos.sort((a, b) => a.id - b.id);
    } else if (sortOption === 'newest') {
      sortedTodos = filteredTodos.sort((a, b) => b.id - a.id);
    }

    this.setState({ filteredTodos: sortedTodos });
  };

  handleSortDropdownChange = (event) => {
    const sortOption = event.target.value;
    this.setState({ sortOption }, this.sortTodoList);
  };

  selectAll = () => {
    this.setState((prevState) => ({
      todos: prevState.todos.map((todo) => ({
        ...todo,
        completed: true
      }))
    }));
  };

  deselectAll = () => {
    this.setState((prevState) => ({
      todos: prevState.todos.map((todo) => ({
        ...todo,
        completed: false
      }))
    }));
  };

  deleteSelected = () => {
    this.setState((prevState) => ({
      todos: prevState.todos.filter((todo) => !todo.completed)
    }));
  };

  render() {
    const { filteredTodos, searchTerm, sortOption } = this.state;

    return (
      <div className="container">
        <h1>To-Do List</h1>
        <form id="todo-form" onSubmit={this.addTodoItem}>
          <input type="text" id="todo-input" placeholder="Enter a to-do item" />
          <button type="submit">Add</button>
        </form>

        <input
          type="text"
          id="search-input"
          placeholder="Search"
          value={searchTerm}
          onChange={this.handleSearchInputChange}
        />
        <ul id="todo-list">
          {filteredTodos.map((todo) => (
            <li key={todo.id} className={todo.completed ? 'completed' : ''}>
              <input
                type="checkbox"
                className="todo-checkbox"
                checked={todo.completed}
                onChange={() => this.toggleCompletionStatus(todo.id)}
              />
              <span>{todo.text}</span>
              <button className="edit-btn" onClick={() => this.editTodoItem(todo.id)}>
                Edit
              </button>
              <button className="delete-btn" onClick={() => this.deleteTodoItem(todo.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
        <div className="tabs">
          <button id="all-tab" className="tab-button" onClick={this.handleTabClick}>
            All
          </button>
          <button id="active-tab" className="tab-button" onClick={this.handleTabClick}>
            Active
          </button>
          <button id="completed-tab" className="tab-button" onClick={this.handleTabClick}>
            Completed
          </button>
        </div>
        <br />
        <div className="todo-actions">
          <button id="select-all-btn" onClick={this.selectAll}>
            Select All
          </button>
          <button id="deselect-all-btn" onClick={this.deselectAll}>
            Deselect All
          </button>
          <button id="delete-selected-btn" onClick={this.deleteSelected}>
            Delete Selected
          </button>
        </div>
        <br />
        <div className="sort">
          <label htmlFor="sort-dropdown">Sort By:</label>
          <select id="sort-dropdown" value={sortOption} onChange={this.handleSortDropdownChange}>
            <option value="A-Z">A-Z</option>
            <option value="Z-A">Z-A</option>
            <option value="oldest">Oldest</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>
    );
  }
}

export default TodoList;
