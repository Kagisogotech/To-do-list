import React, { useState, useEffect } from 'react';
import { Todo } from '../types';
import { TrashIcon, CheckIcon, PencilIcon, XCircleIcon, CalendarIcon, FlagIcon } from './IconComponents';

interface TodoItemProps {
    todo: Todo;
    toggleTodo: (id: number) => void;
    deleteTodo: (id: number) => void;
    updateTodo: (id: number, newText: string, newCategory: string, newDueDate: string | null, newPriority: number) => void;
    onMouseEnter: () => void;
    isBlurred: boolean;
    isEditing: boolean;
    setEditingId: (id: number | null) => void;
}

const categoryColors = [
    'bg-pink-500/20 text-pink-300 border-pink-500/30',
    'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'bg-green-500/20 text-green-300 border-green-500/30',
    'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    'bg-purple-500/20 text-purple-300 border-purple-500/30',
    'bg-orange-500/20 text-orange-300 border-orange-500/30',
];

const priorityMap: { [key: number]: { color: string; label: string } } = {
    1: { color: 'text-red-400', label: 'High' },
    2: { color: 'text-yellow-400', label: 'Medium' },
    3: { color: 'text-sky-400', label: 'Low' },
};

const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % categoryColors.length);
    return categoryColors[index];
};


const TodoItem: React.FC<TodoItemProps> = ({ todo, toggleTodo, deleteTodo, updateTodo, onMouseEnter, isBlurred, isEditing, setEditingId }) => {
    const [editText, setEditText] = useState(todo.text);
    const [editCategory, setEditCategory] = useState(todo.category || '');
    const [editDueDate, setEditDueDate] = useState(todo.dueDate || '');
    const [editPriority, setEditPriority] = useState(String(todo.priority));


    useEffect(() => {
        if (isEditing) {
            setEditText(todo.text);
            setEditCategory(todo.category || '');
            setEditDueDate(todo.dueDate || '');
            setEditPriority(String(todo.priority));
        }
    }, [isEditing, todo.text, todo.category, todo.dueDate, todo.priority]);

    const handleUpdate = () => {
        if (editText.trim()) {
            updateTodo(todo.id, editText.trim(), editCategory.trim(), editDueDate || null, parseInt(editPriority, 10));
        } else {
            setEditingId(null);
        }
    };
    
    const handleCancel = () => {
        setEditingId(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleUpdate();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };
    
    if (isEditing) {
        const inputStyles = "w-full bg-gray-600 border-2 border-gray-500 text-white placeholder-gray-400 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300";
        return (
            <li className="bg-gray-700/60 p-4 rounded-lg shadow-lg ring-2 ring-indigo-500 transition-all duration-300">
                <div className="flex flex-col gap-3">
                    <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className={inputStyles}
                        onKeyDown={handleKeyDown}
                        aria-label="Edit todo text"
                        autoFocus
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                            type="text"
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            placeholder="Category"
                            className={`${inputStyles} text-sm`}
                            onKeyDown={handleKeyDown}
                            aria-label="Edit todo category"
                        />
                        <select
                            value={editPriority}
                            onChange={(e) => setEditPriority(e.target.value)}
                            className={`${inputStyles} text-sm`}
                            onKeyDown={handleKeyDown}
                            aria-label="Edit priority"
                        >
                            <option value="1">High Priority</option>
                            <option value="2">Medium Priority</option>
                            <option value="3">Low Priority</option>
                        </select>
                        <input
                            type="datetime-local"
                            value={editDueDate}
                            onChange={(e) => setEditDueDate(e.target.value)}
                            className={`${inputStyles} text-sm`}
                            onKeyDown={handleKeyDown}
                            aria-label="Edit due date and time"
                            min={new Date().toISOString().slice(0, 16)}
                        />
                    </div>
                    <div className="flex justify-end gap-2 items-center">
                        <button onClick={handleCancel} className="text-gray-400 hover:text-white p-2 rounded-full transition-colors duration-200" aria-label="Cancel edit">
                            <XCircleIcon className="w-6 h-6" />
                        </button>
                        <button onClick={handleUpdate} className="text-green-400 hover:text-white p-2 rounded-full transition-colors duration-200" aria-label="Save changes">
                            <CheckIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </li>
        );
    }
    
    const DueDateDisplay = () => {
        if (!todo.dueDate) return null;
        
        const dueDate = new Date(todo.dueDate);
        const isOverdue = dueDate.getTime() < new Date().getTime() && !todo.completed;

        const formattedDate = dueDate.toLocaleString('en-US', {
            month: 'short', 
            day: 'numeric', 
            hour: 'numeric', 
            minute: '2-digit', 
            hour12: true
        }).replace(',', ' at');

        return (
            <div className={`flex items-center gap-1.5 text-xs whitespace-nowrap ${isOverdue ? 'text-red-400 font-semibold' : 'text-gray-400'}`}>
                <CalendarIcon className="w-4 h-4" />
                <span>{formattedDate}</span>
            </div>
        );
    };

    const CompletionDateDisplay = () => {
        if (!todo.completedAt) return null;
        
        const completedDate = new Date(todo.completedAt);
        const formattedDate = completedDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
        
        return (
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <CheckIcon className="w-4 h-4 text-green-400" />
                <span>Completed: {formattedDate}</span>
            </div>
        );
    };

    const PriorityDisplay = () => {
        const priorityInfo = priorityMap[todo.priority];
        if (!priorityInfo) return null;

        return (
             <div className={`flex items-center gap-1.5 text-xs font-medium whitespace-nowrap ${priorityInfo.color}`}>
                <FlagIcon className="w-4 h-4" />
                <span>{priorityInfo.label}</span>
            </div>
        );
    };

    return (
        <li 
            onMouseEnter={onMouseEnter}
            className={`group flex items-center justify-between bg-gray-700/40 p-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:bg-gray-700/60 hover:!opacity-100 hover:!blur-none hover:scale-[1.02] ${isBlurred ? 'filter blur-sm opacity-50' : ''}`}>
            <div className="flex items-start gap-4 cursor-pointer flex-grow min-w-0" onClick={() => toggleTodo(todo.id)}>
                <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 shrink-0 mt-0.5 ${
                        todo.completed
                            ? 'bg-indigo-500 border-indigo-500'
                            : 'border-gray-500 group-hover:border-indigo-400'
                    }`}
                >
                    {todo.completed && <CheckIcon className="w-4 h-4 text-white" />}
                </div>
                <div className="flex flex-col min-w-0">
                    <span className={`text-gray-200 transition-all duration-300 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                        {todo.text}
                    </span>
                    {(todo.category || todo.dueDate || todo.completedAt || todo.priority) && (
                        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-2">
                            {!todo.completed && <PriorityDisplay />}
                            {todo.category && (
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border whitespace-nowrap ${stringToColor(todo.category)}`}>
                                    {todo.category}
                                </span>
                            )}
                            {todo.completed ? <CompletionDateDisplay /> : <DueDateDisplay />}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex items-center shrink-0">
                 {!todo.completed && (
                    <button
                        onClick={() => setEditingId(todo.id)}
                        className="text-gray-500 opacity-0 group-hover:opacity-100 hover:text-blue-400 transition-all duration-300 transform scale-75 group-hover:scale-100 p-1"
                        aria-label={`Edit todo: ${todo.text}`}
                    >
                        <PencilIcon className="w-5 h-5" />
                    </button>
                 )}
                <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-gray-500 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all duration-300 transform scale-75 group-hover:scale-100 p-1 ml-1"
                    aria-label={`Delete todo: ${todo.text}`}
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>
        </li>
    );
};

export default TodoItem;