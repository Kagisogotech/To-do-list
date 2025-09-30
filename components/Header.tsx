
import React from 'react';
import { CheckSquareIcon } from './IconComponents';

interface HeaderProps {
    userName: string;
}

const Header: React.FC<HeaderProps> = ({ userName }) => {
    return (
        <header className="text-center mb-8">
            <div className="flex items-center justify-center gap-3">
                 <CheckSquareIcon className="w-10 h-10 text-indigo-500" />
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-100 tracking-tight">
                    {userName}'s Todos
                </h1>
            </div>
            <p className="text-gray-400 mt-2">Your personal productivity partner</p>
        </header>
    );
};

export default Header;
