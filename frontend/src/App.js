import './App.css';
import HomePage from "./Pages/HomePage";
import ChatPage from "./Pages/ChatPage";
import { Route, Routes } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <Routes>
       <Route exact path='/' element={<HomePage/>} />
       <Route exact path='/chats' element={<ChatPage/>} />
      </Routes>
    </div>
  );
}

export default App;
