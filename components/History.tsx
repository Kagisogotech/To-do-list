import React from 'react';
import { Todo } from '../types';
import TodoItem from './TodoItem';
import { ArchiveBoxIcon } from './IconComponents';

interface HistoryProps {
    completedTodos: Todo[];
    toggleTodo: (id: number) => void;
    deleteTodo: (id: number) => void;
    clearHistory: () => void;
}

const History: React.FC<HistoryProps> = ({ completedTodos, toggleTodo, deleteTodo, clearHistory }) => {
    if (completedTodos.length === 0) {
        return (
            <div className="text-center py-10 px-4 bg-gray-800/50 rounded-lg">
                <ArchiveBoxIcon className="w-16 h-16 mx-auto text-gray-600" />
                <h3 className="mt-4 text-lg font-medium text-gray-300">History is empty</h3>
                <p className="mt-1 text-sm text-gray-400">Completed tasks will appear here.</p>
            </div>
        );
    }
    
    // Sort by completion date, newest first
    const sortedCompleted = [...completedTodos].sort((a, b) => {
        if (a.completedAt && b.completedAt) {
            return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
        }
        return 0;
    });

    return (
        <div>
            <div className="flex justify-end mb-4">
                <button
                    onClick={clearHistory}
                    className="text-sm text-gray-400 hover:text-red-400 transition-colors duration-300"
                >
                    Clear All History
                </button>
            </div>
            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                <ul className="space-y-3">
                    {sortedCompleted.map(todo => (
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            toggleTodo={toggleTodo}
                            deleteTodo={deleteTodo}
                            updateTodo={() => {}}
                            onMouseEnter={() => {}}
                            isBlurred={false}
                            isEditing={false}
                            setEditingId={() => {}}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default History;
