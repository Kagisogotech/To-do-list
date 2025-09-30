import React from 'react';
import { CheckSquareIcon } from './IconComponents';

const Header: React.FC = () => {
    return (
        <header className="text-center mb-8">
            <div className="flex items-center justify-center gap-3">
                 <CheckSquareIcon className="w-10 h-10 text-blue-500" />
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-100 tracking-tight">
                    Creative To-dos
                </h1>
            </div>
            <p className="text-gray-400 mt-2">Your personal productivity partner</p>
        </header>
    );
};

export default Header;