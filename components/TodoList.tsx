import React, { useState } from 'react';
import { Todo } from '../types';
import TodoItem from './TodoItem';
import { ClipboardListIcon } from './IconComponents';

interface TodoListProps {
    todos: Todo[];
    toggleTodo: (id: number) => void;
    deleteTodo: (id: number) => void;
    updateTodo: (id: number, text: string, category: string, dueDate: string | null, priority: number) => void;
    editingId: number | null;
    setEditingId: (id: number | null) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, toggleTodo, deleteTodo, updateTodo, editingId, setEditingId }) => {
    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState<'creation' | 'dueDate'>('creation');

    if (todos.length === 0) {
        return (
            <div className="text-center py-10 px-4 bg-gray-800/50 rounded-lg">
                <ClipboardListIcon className="w-16 h-16 mx-auto text-gray-600" />
                <h3 className="mt-4 text-lg font-medium text-gray-300">All tasks completed!</h3>
                <p className="mt-1 text-sm text-gray-400">Ready to add something new?</p>
            </div>
        );
    }

    const getGroupedAndSortedTodos = () => {
        const sorted = [...todos].sort((a, b) => {
            // Primary sort: by priority
            if (a.priority !== b.priority) {
                return a.priority - b.priority;
            }

            // Secondary sort: user's choice
            if (sortBy === 'dueDate') {
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            }
            
            // Default secondary sort by creation date (newest first)
            return b.id - a.id;
        });

        return sorted.reduce((acc, todo) => {
            const category = todo.category || 'General';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(todo);
            return acc;
        }, {} as Record<string, Todo[]>);
    };

    const groupedTodos = getGroupedAndSortedTodos();

    const buttonStyle = (sortType: typeof sortBy) => 
        `transition-colors duration-200 ${sortBy === sortType ? 'text-indigo-400 font-semibold' : 'text-gray-500 hover:text-white'}`;

    return (
        <>
            <div className="flex justify-end items-center mb-4 text-sm gap-2">
                <span className="text-gray-400">Sort by:</span>
                <button onClick={() => setSortBy('creation')} className={buttonStyle('creation')}>Creation Date</button>
                <span className="text-gray-600">|</span>
                <button onClick={() => setSortBy('dueDate')} className={buttonStyle('dueDate')}>Due Date</button>
            </div>
            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2" onMouseLeave={() => setHoveredId(null)}>
                {Object.entries(groupedTodos).map(([category, categoryTodos]) => (
                    <div key={category}>
                        <h3 className="text-sm font-semibold uppercase text-indigo-400/80 mb-2 px-1 tracking-wider">{category}</h3>
                        <ul className="space-y-3">
                            {categoryTodos.map(todo => (
                                <TodoItem
                                    key={todo.id}
                                    todo={todo}
                                    toggleTodo={toggleTodo}
                                    deleteTodo={deleteTodo}
                                    updateTodo={updateTodo}
                                    onMouseEnter={() => setHoveredId(todo.id)}
                                    isBlurred={editingId === null && hoveredId !== null && hoveredId !== todo.id}
                                    isEditing={editingId === todo.id}
                                    setEditingId={setEditingId}
                                />
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </>
    );
};

export default TodoList;