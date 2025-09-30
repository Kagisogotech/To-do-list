import React, { useState } from 'react';
import { PlusIcon } from './IconComponents';

interface TodoFormProps {
    addTodo: (text: string, category: string, dueDate: string | null, priority: number) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ addTodo }) => {
    const [text, setText] = useState('');
    const [category, setCategory] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('2');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            addTodo(text.trim(), category.trim() || 'General', dueDate || null, parseInt(priority, 10));
            setText('');
            setCategory('');
            setDueDate('');
            setPriority('2');
        }
    };
    
    const inputStyles = "bg-gray-700/50 border-2 border-gray-600 text-white placeholder-gray-400 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300";
    const smallInputStyles = "bg-gray-700/50 border-2 border-gray-600 text-white placeholder-gray-400 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300 w-full text-sm";

    return (
        <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex items-center gap-3">
                 <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Add a new task..."
                    className={`flex-grow ${inputStyles}`}
                />
                <button
                    type="submit"
                    className="bg-indigo-500 text-white rounded-lg p-3 shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105 disabled:bg-indigo-400/50 disabled:cursor-not-allowed shrink-0"
                    disabled={!text.trim()}
                    aria-label="Add new todo"
                >
                    <PlusIcon className="w-6 h-6" />
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Category (e.g., Work)"
                    className={smallInputStyles}
                />
                 <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className={smallInputStyles}
                    aria-label="Task priority"
                >
                    <option value="1">High Priority</option>
                    <option value="2">Medium Priority</option>
                    <option value="3">Low Priority</option>
                </select>
                <input
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className={smallInputStyles}
                    aria-label="Due date and time"
                    min={new Date().toISOString().slice(0, 16)}
                />
            </div>
        </form>
    );
};

export default TodoForm;