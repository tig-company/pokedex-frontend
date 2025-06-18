'use client';

interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}

export function Checkbox({
  id,
  checked,
  onChange,
  label,
  description,
  disabled = false,
}: CheckboxProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex items-center h-5">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded 
                     focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 
                     focus:ring-2 dark:bg-gray-700 dark:border-gray-600
                     disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
      
      <div className="flex-1">
        <label
          htmlFor={id}
          className={`text-sm font-medium text-gray-900 dark:text-white 
                     ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {label}
        </label>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}