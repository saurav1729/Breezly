import { Sun, Moon } from "lucide-react";
import useTheme from "../context/theme";

const DarkModeBtn = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="relative w-20 h-10 flex items-center px-1 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 shadow-md hover:cursor-pointer transition-all duration-300"
    >
      <div
        className={`absolute left-1 top-1/2 transform -translate-y-1/2 w-7 h-7 bg-white rounded-full flex items-center justify-center transition-all duration-500 ${
          darkMode ? "translate-x-10" : "translate-x-0"
        }`}
      >
        {darkMode ? (
          <Moon size={18} className="text-blue-700" />
        ) : (
          <Sun size={18} className="text-yellow-500" />
        )}
      </div>

      <div className="flex w-full justify-between items-center px-3 text-white text-sm font-medium">
        <Sun size={14} />
        <Moon size={14} />
      </div>
    </button>
  );
};

export default DarkModeBtn;
