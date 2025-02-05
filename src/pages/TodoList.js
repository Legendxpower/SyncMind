import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { title: newTask, priority: 'Normal', deadline: null }]);
      setNewTask('');
    }
  };

  const handleEditTask = (index) => {
    setNewTask(tasks[index].title);
    setEditIndex(index);
  };

  const handleSaveEdit = () => {
    if (newTask.trim() && editIndex !== null) {
      const updatedTasks = tasks.map((task, index) =>
        index === editIndex ? { ...task, title: newTask } : task
      );
      setTasks(updatedTasks);
      setNewTask('');
      setEditIndex(null);
    }
  };

  const handleDeleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedTasks = Array.from(tasks);
    const [movedTask] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, movedTask);
    setTasks(reorderedTasks);
  };

  return (
    <div className="todo-list-page max-w-4xl mx-auto mt-10 p-5">
      <h1 className="text-3xl font-bold mb-6">To-Do List</h1>
      <input
        type="text"
        placeholder="Enter new task"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
      />
      {editIndex !== null ? (
        <button onClick={handleSaveEdit} className="bg-green-500 text-white px-4 py-2 rounded mb-4">Save Edit</button>
      ) : (
        <button onClick={handleAddTask} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">Add Task</button>
      )}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <ul className="list-disc pl-5" {...provided.droppableProps} ref={provided.innerRef}>
              {tasks.map((task, index) => (
                <Draggable key={index} draggableId={`task-${index}`} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="mb-2"
                    >
                      {task.title} <span className="text-sm text-gray-500">[Priority: {task.priority}]</span>
                      <button onClick={() => handleEditTask(index)} className="ml-2 text-blue-500">Edit</button>
                      <button onClick={() => handleDeleteTask(index)} className="ml-2 text-red-500">Delete</button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TodoList;
