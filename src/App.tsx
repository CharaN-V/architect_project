import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import { HomePage } from './pages/HomePage';
import { TasksPage } from './pages/TasksPage';
import { FilteredTasksPage } from './pages/FilteredTasksPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TaskForm } from './components/TaskForm';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openTaskForm = () => {
    setIsTaskFormOpen(true);
  };

  const closeTaskForm = () => {
    setIsTaskFormOpen(false);
  };

  return (
    <TaskProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex">
          {/* Desktop Sidebar - hidden on mobile */}
          <div className="hidden lg:block lg:w-64 flex-shrink-0">
            <Sidebar isMobile={false} isOpen={true} onClose={() => {}} />
          </div>
          
          {/* Mobile Sidebar - shown when toggled */}
          {isSidebarOpen && (
            <div className="fixed inset-0 z-40 lg:hidden" onClick={toggleSidebar}>
              <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
            </div>
          )}
          <Sidebar isMobile={true} isOpen={isSidebarOpen} onClose={toggleSidebar} />
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header onToggleSidebar={toggleSidebar} onCreateTask={openTaskForm} />
            
            <main className="flex-1 overflow-y-auto">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/:filter" element={<FilteredTasksPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/settings" element={<TasksPage />} />
              </Routes>
            </main>
            
            <TaskForm isOpen={isTaskFormOpen} onClose={closeTaskForm} />
          </div>
        </div>
      </Router>
    </TaskProvider>
  );
}

export default App;