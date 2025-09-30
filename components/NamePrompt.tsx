
import React, { useState } from 'react';
import { ArrowRightIcon } from './IconComponents';

interface NamePromptProps {
    onNameSubmit: (name: string) => void;
}

const NamePrompt: React.FC<NamePromptProps> = ({ onNameSubmit }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onNameSubmit(name.trim());
        }
    };

    return (
        <div className="min-h-screen text-white flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-100 tracking-tight">
                    Welcome!
                </h1>
                <p className="text-gray-400 mt-3 text-lg">What should I call you?</p>
                <form onSubmit={handleSubmit} className="mt-8 flex items-center gap-3">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name..."
                        className="flex-grow bg-gray-700/50 border-2 border-gray-600 text-white placeholder-gray-400 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300 text-lg"
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="bg-indigo-500 text-white rounded-lg p-3 shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105 disabled:bg-indigo-400/50 disabled:cursor-not-allowed shrink-0"
                        disabled={!name.trim()}
                        aria-label="Submit name"
                    >
                        <ArrowRightIcon className="w-6 h-6" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NamePrompt;
