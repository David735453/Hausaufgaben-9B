import { useState, useRef, useEffect } from 'react';

export default function PermissionDropdown({
  currentPermissionLevel,
  onPermissionChange,
  username,
  isDavid,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (level) => {
    onPermissionChange(username, level);
    setIsOpen(false);
  };

  const permissionOptions = [
    { level: 0, label: '0: Admin' },
    { level: 1, label: '1: Create' },
    { level: 2, label: '2: Create & Edit' },
    { level: 3, label: '3: Create, Edit & Delete' },
  ];

  if (isDavid) {
    return (
      <span className="text-gray-500 dark:text-gray-400 text-sm">
        (Level: {currentPermissionLevel})
      </span>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 10a2 2 0 110-4 2 2 0 010 4zm0-8a2 2 0 110-4 2 2 0 010 4z"></path>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
          <div className="py-1">
            {permissionOptions.map((option) => (
              <button
                key={option.level}
                onClick={() => handleOptionClick(option.level)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
