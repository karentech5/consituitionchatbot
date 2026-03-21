// App.jsx
// Root component that assembles the full-page Nepal Constitution Chatbot.
// Layout: full-height flex column — Header at top, Chat in middle, Footer at bottom.

import Header from './components/Header';
import ChatBox from './components/ChatBox';
import './index.css';

const App = () => {
  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">

      {/* Fixed top header with Nepal imagery */}
      <Header />

      {/* Scrollable chat area — grows to fill remaining space */}
      <main className="flex flex-1 overflow-hidden">
        <ChatBox />
      </main>
    </div>
  );
};

export default App;
