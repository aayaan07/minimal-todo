import { useState, useEffect } from 'react'
import './App.css'
import { MdDeleteOutline } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import Checkbox from "react-custom-checkbox";
import Modal from 'react-modal';
import { v4 as uuidv4 } from 'uuid';
import { FaGithub } from "react-icons/fa";
import '../public/bg.png';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

Modal.setAppElement('#root');

function App() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [todos, setTodos] = useState([]);
  const [username, setUsername] = useState("");
  const [todo, setTodo] = useState("");

  useEffect(() => {
    let curTodos = JSON.parse(localStorage.getItem("todos"))
    if (curTodos) {
      setTodos(curTodos)
    }
  }, [])

  useEffect(() => {
    saveToLS()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todos])


  const saveToLS = () => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }


  useEffect(() => {
    let username = localStorage.getItem("username");

    if (username === 'null' || username == null) {
      openModal();
    } else {
      setUsername(username);
    }
  }, []);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function setInputUsername() {
    closeModal()
    localStorage.setItem("username", username)
  }

  const addTodo = () => {
    let curTodo = {
      id: uuidv4(),
      text: todo ? todo : "Hey Don't add Empty todos, it will become messy...",
      isCompleted: false
    }
    todos.unshift(curTodo)
    setTodo('')
    saveToLS()
  }

  const handleCheckBox = (id) => {
    setTodos(prevTodos => {
      const index = prevTodos.findIndex(todo => todo.id === id);
      const newTodos = [...prevTodos];
      newTodos[index].isCompleted = !newTodos[index].isCompleted;
      return newTodos;
    });
    saveToLS()
  };

  const handleDelete = (id) => {
    setTodos(prevTodos => {
      let newTodos = prevTodos.filter(todo => {
        return todo.id !== id
      })
      return newTodos
    })
  }





  return (
    <>
      <div className="container">

        <div className="header">
          <small className='nameText'>Hey {username}</small>
          <small className='heading'>Todo List</small>
          <small className='belowHeading'>Stay organized and productive with our simple todo list.</small>

          <div className="inputCon">
            <input placeholder='Add a new todo...' type="text" name="todo" autoComplete="off" value={todo} onChange={(e) => {
              e.preventDefault()
              setTodo(e.target.value)
            }} />
            <button onClick={addTodo}>Add</button>
          </div>

        </div>

        <div className="todoContainer">
          <div className="todoTop">
            Your Todos
          </div>
          <div className="todos">

            {todos.map((todo) => {
              return (
                <div key={todo.id}>
                  <div className="todo">
                    <Checkbox
                      id={todo.id}
                      className='checkBox'
                      size={18}
                      icon={<FaCheck color="#0" size={14} />}
                      checked={todo.isCompleted ? true : false}
                      borderColor="#000"
                      borderWidth="1px"
                      style={{ cursor: "pointer", background: "transparent" }}
                      onChange={() => handleCheckBox(todo.id)}
                    />
                    <small className='todoText'>{todo.text}</small>
                    <MdDeleteOutline className='icon' onClick={() => handleDelete(todo.id)} />
                  </div>

                  <hr></hr>
                </div>
              )
            })}


          </div>
        </div>

      </div>

      <div className='githubContainer' onClick={window.open('https://github.com/aayaan07/minimal-todo', '_blank')} >
        <FaGithub className='github' />
      </div>


      <Modal
        isOpen={modalIsOpen}
        style={customStyles}
        contentLabel="Username Modal"
      >
        <form className="modal">
          <h3>Please enter your name</h3>
          <input type="text" name="username" autoComplete="off" required value={username} onChange={(e) => setUsername(e.target.value)} />
          <button type='submit' onClick={setInputUsername}>Submit</button>
        </form>
      </Modal>
    </>
  )
}

export default App
