import { useState } from 'react';
import User from './User'

const getUsers = async () => {
  const response = await fetch('http://localhost:3001/api/users');
  return response.json;
}

function App() {
  const [users, setUsers] = useState(['a', 'b', 'c', 'd']);
  const [inputText, setInputText] = useState('');

  getUsers()
    .then((data) => console.log(data))
    .catch((err) => console.log(err));

  const userList = users.map((user) => {
    return <User key={user} name={user} />
  })

  const handleSubmit = (event) => {
    event.preventDefault();
    const newUsers = [...users, inputText];
    setUsers(newUsers);
  };

  const handleChange = (event) => {
    setInputText(event.target.value);
  };

  return (
    <div className="App">
      <ul>{userList}</ul>
      <form onSubmit={handleSubmit}>
        <input type="text" onChange={handleChange} />
        <button type="submit">追加</button>
      </form>
    </div>
  );
}

export default App;
