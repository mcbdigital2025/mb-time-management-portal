import React from "react";

const baseWrapperClass =
  "flex items-center gap-3 rounded-full border border-white/30 bg-white/25 px-4 py-3 backdrop-blur focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100";

const textareaWrapperClass =
  "rounded-2xl border border-white/30 bg-white/25 px-4 py-3 backdrop-blur focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100";

const baseInputClass =
  "w-full bg-transparent text-[15px] text-zinc-800 outline-none placeholder:text-zinc-500/80 disabled:cursor-not-allowed disabled:opacity-70";

const FormField = ({
  label,
  name,
  required = false,
  icon,
  as = "input",
  options = [],
  className = "",
  wrapperClassName = "",
  ...props
}) => {
  const id = props.id || name;
  const isTextarea = as === "textarea";
  const isSelect = as === "select";

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-2 block text-sm font-medium text-zinc-800">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        className={`${isTextarea ? textareaWrapperClass : baseWrapperClass} ${wrapperClassName}`}
      >
        {icon && <span className="shrink-0">{icon}</span>}

        {as === "textarea" ? (
          <textarea
            id={id}
            name={name}
            className={`${baseInputClass} resize-none`}
            {...props}
          />
        ) : isSelect ? (
          <select id={id} name={name} className={baseInputClass} {...props}>
            {options.map((option) =>
              typeof option === "string" ? (
                <option key={option} value={option}>
                  {option}
                </option>
              ) : (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ),
            )}
          </select>
        ) : (
          <input id={id} name={name} className={baseInputClass} {...props} />
        )}
      </div>
    </div>
  );
};

export default FormField;