import React, { useState, useEffect } from 'react';
import { Todo } from './types';
import Header from './components/Header';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import History from './components/History';
import AlarmNotification from './components/AlarmNotification';
import { ArchiveBoxIcon, ClipboardListIcon } from './components/IconComponents';

const App: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [view, setView] = useState<'list' | 'history'>('list');
    const [alarmingTodo, setAlarmingTodo] = useState<Todo | null>(null);
    const [alarmedTodoIds, setAlarmedTodoIds] = useState<number[]>(() => {
        try {
            const saved = localStorage.getItem('alarmedTodoIds');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error("Failed to parse alarmedTodoIds from localStorage", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            const storedTodos = localStorage.getItem('todos');
            if (storedTodos) {
                // FIX: Add parentheses to correctly type parsedTodos as an array of objects.
                const parsedTodos: (Omit<Todo, 'priority'> & { priority?: number })[] = JSON.parse(storedTodos);
                // Add default priority for backward compatibility
                const todosWithPriority = parsedTodos.map(todo => ({
                    ...todo,
                    priority: todo.priority || 2, // Default to Medium
                }));
                setTodos(todosWithPriority);
            }
        } catch (error) {
            console.error("Failed to parse todos from localStorage", error);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('todos', JSON.stringify(todos));
        } catch (error) {
            console.error("Failed to save todos to localStorage", error);
        }
    }, [todos]);

    useEffect(() => {
        try {
            localStorage.setItem('alarmedTodoIds', JSON.stringify(alarmedTodoIds));
        } catch (error) {
            console.error("Failed to save alarmedTodoIds to localStorage", error);
        }
    }, [alarmedTodoIds]);

    const activeTodos = todos.filter(todo => !todo.completed);
    const completedTodos = todos.filter(todo => todo.completed);

    useEffect(() => {
        const FIVE_MINUTES_MS = 5 * 60 * 1000;
        const intervalId = setInterval(() => {
            if (alarmingTodo) return;

            const now = new Date().getTime();
            const upcomingTask = activeTodos.find(todo => {
                if (!todo.dueDate) return false;
                
                const dueTime = new Date(todo.dueDate).getTime();
                const timeUntilDue = dueTime - now;

                const isDueSoon = timeUntilDue > 0 && timeUntilDue <= FIVE_MINUTES_MS;
                const hasNotBeenAlarmed = !alarmedTodoIds.includes(todo.id);

                return isDueSoon && hasNotBeenAlarmed;
            });
            
            if (upcomingTask) {
                setAlarmingTodo(upcomingTask);
                setAlarmedTodoIds(prev => [...prev, upcomingTask.id]);
            }
        }, 10000); // Check every 10 seconds

        return () => clearInterval(intervalId);
    }, [activeTodos, alarmedTodoIds, alarmingTodo]);

    const addTodo = (text: string, category: string, dueDate: string | null, priority: number) => {
        const newTodo: Todo = {
            id: Date.now(),
            text,
            completed: false,
            priority,
            category,
            dueDate: dueDate || undefined,
        };
        setTodos(prevTodos => [newTodo, ...prevTodos]);
    };

    const toggleTodo = (id: number) => {
        setTodos(
            todos.map(todo =>
                todo.id === id ? { 
                    ...todo, 
                    completed: !todo.completed,
                    completedAt: !todo.completed ? new Date().toISOString() : undefined
                } : todo
            )
        );
    };

    const deleteTodo = (id: number) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const updateTodo = (id: number, newText: string, newCategory: string, newDueDate: string | null, newPriority: number) => {
        setTodos(todos.map(todo => 
            todo.id === id ? { ...todo, text: newText, category: newCategory || 'General', dueDate: newDueDate || undefined, priority: newPriority } : todo
        ));
        setEditingId(null);
    };

    const clearHistory = () => {
        setTodos(todos.filter(todo => !todo.completed));
    };
    
    const dismissAlarm = () => {
        setAlarmingTodo(null);
    };

    const TabButton: React.FC<{
        active: boolean;
        onClick: () => void;
        label: string;
        count: number;
        children: React.ReactNode;
    }> = ({ active, onClick, label, count, children }) => (
        <button
            onClick={onClick}
            className={`flex items-center justify-center gap-2 pb-3 pt-1 border-b-2 -mb-px transition-all duration-300 ${
                active
                    ? 'border-indigo-500 text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
            }`}
        >
            {children}
            <span className="font-semibold">{label}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${active ? 'bg-indigo-500/50 text-white' : 'bg-gray-600/50 text-gray-300'}`}>{count}</span>
        </button>
    );

    return (
        <div className="min-h-screen text-white flex items-center justify-center p-4 font-sans">
            {alarmingTodo && <AlarmNotification todo={alarmingTodo} onDismiss={dismissAlarm} />}
            <div className="w-full max-w-lg mx-auto bg-slate-800/50 backdrop-blur-lg shadow-2xl shadow-indigo-500/10 rounded-2xl p-6 md:p-8">
                <Header />
                <TodoForm addTodo={addTodo} />

                <div className="border-b border-slate-700/50 mt-8 mb-6 -mx-6 md:-mx-8">
                    <div className="flex px-6 md:px-8 gap-6">
                        <TabButton
                            active={view === 'list'}
                            onClick={() => setView('list')}
                            label="Tasks"
                            count={activeTodos.length}
                        >
                            <ClipboardListIcon className="w-5 h-5" />
                        </TabButton>
                        <TabButton
                            active={view === 'history'}
                            onClick={() => setView('history')}
                            label="History"
                            count={completedTodos.length}
                        >
                            <ArchiveBoxIcon className="w-5 h-5" />
                        </TabButton>
                    </div>
                </div>
                
                {view === 'list' ? (
                    <TodoList
                        todos={activeTodos}
                        toggleTodo={toggleTodo}
                        deleteTodo={deleteTodo}
                        updateTodo={updateTodo}
                        editingId={editingId}
                        setEditingId={setEditingId}
                    />
                ) : (
                    <History
                        completedTodos={completedTodos}
                        toggleTodo={toggleTodo}
                        deleteTodo={deleteTodo}
                        clearHistory={clearHistory}
                    />
                )}

                 <footer className="text-center pt-6 mt-6 border-t border-gray-700/50 text-xs text-gray-500">
                    Created by Kagiso Monene
                </footer>
            </div>
        </div>
    );
};

export default App;