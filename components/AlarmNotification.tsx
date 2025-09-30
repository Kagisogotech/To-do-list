import React from 'react';
import { Todo } from '../types';
import { BellRingingIcon, XCircleIcon } from './IconComponents';

interface AlarmNotificationProps {
  todo: Todo;
  onDismiss: () => void;
}

const AlarmNotification: React.FC<AlarmNotificationProps> = ({ todo, onDismiss }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{ perspective: '1000px' }}>
      <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl shadow-2xl shadow-indigo-500/50 w-full max-w-md p-6 transform-gpu transition-transform duration-500" style={{ transform: 'rotateY(-10deg) rotateX(5deg) scale(1)', transformStyle: 'preserve-3d' }}>
        <div style={{ transform: 'translateZ(40px)' }}>
          <div className="flex items-center gap-4">
            <BellRingingIcon className="w-12 h-12 text-yellow-300 animate-wiggle" />
            <div>
              <h2 className="text-xl font-bold">Task Due Soon!</h2>
              <p className="text-indigo-200">The following task is due in under 5 minutes:</p>
            </div>
          </div>
          <div className="mt-4 bg-black/20 p-4 rounded-lg">
            <p className="font-semibold text-lg">{todo.text}</p>
            {todo.category && <p className="text-sm text-indigo-200 mt-1">Category: {todo.category}</p>}
          </div>
          <button
            onClick={onDismiss}
            className="absolute -top-3 -right-3 bg-slate-800 rounded-full p-1 text-gray-400 hover:text-white hover:bg-slate-700 transition-all"
            aria-label="Dismiss notification"
          >
            <XCircleIcon className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlarmNotification;
