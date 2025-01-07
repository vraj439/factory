import React, {useState} from "react";

interface DropdownOption {
  label: string;
  link: string; // URL for redirection
}

interface DropdownProps {
  title: string;
  options: DropdownOption[];
}

const Dropdown: React.FC<DropdownProps> = ({title, options}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  return (
    <li
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="px-4 py-2 focus:outline-none">{title}</button>
      <div
        className={`absolute left-0 mt-2 w-64 bg-white text-black shadow-lg rounded-md transition-all duration-300 ${
          isDropdownOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 translate-y-2 invisible"
        }`}
      >
        <div className="p-4 grid grid-cols-1 gap-2">
          {options.map((option, index) => (
            <a
              key={index}
              href={option.link}
              className="hover:text-blue-600 transition-colors duration-300 p-2 border-b border-gray-100"
            >
              {option.label}
            </a>
          ))}
        </div>
      </div>
    </li>
  );
};

export default Dropdown;
