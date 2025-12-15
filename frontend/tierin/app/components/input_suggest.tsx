"use client"

import { useEffect, useState, useRef } from "react";

interface SuggestInputProps {
   id: string;
   name: string;
   placeholder?: string;
   className?: string;
   required?: boolean;
   suggestions: string[];
   value?: string;
   onChange?: (value: string) => void;
   label?: string;
}

export function SuggestInput({
   id,
   name,
   placeholder,
   className = "auth-input",
   required = false,
   suggestions,
   value: controlledValue,
   onChange,
   label
}: SuggestInputProps) {
   const [inputValue, setInputValue] = useState(() => controlledValue || "");
   const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
   const [showSuggestions, setShowSuggestions] = useState(false);
   const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
   const inputRef = useRef<HTMLInputElement>(null);
   const suggestionsRef = useRef<HTMLDivElement>(null);

   // 外部から制御された値が変わった場合のみ同期
   useEffect(() => {
      if (controlledValue !== undefined && controlledValue !== inputValue) {
         setInputValue(controlledValue);
      }
   }, [controlledValue, inputValue]);

   // 外部クリックでサジェストを閉じる
   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (
            inputRef.current &&
            !inputRef.current.contains(event.target as Node) &&
            suggestionsRef.current &&
            !suggestionsRef.current.contains(event.target as Node)
         ) {
            setShowSuggestions(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
   }, []);

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      onChange?.(value);

      if (value.trim() === "") {
         setFilteredSuggestions([]);
         setShowSuggestions(false);
         setActiveSuggestionIndex(-1);
         return;
      }

      // 入力値に基づいてサジェストをフィルタリング
      const filtered = suggestions.filter((suggestion) =>
         suggestion.toLowerCase().includes(value.toLowerCase())
      );

      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setActiveSuggestionIndex(-1);
   };

   const handleSuggestionClick = (suggestion: string) => {
      setInputValue(suggestion);
      onChange?.(suggestion);
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
   };

   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showSuggestions || filteredSuggestions.length === 0) return;

      if (e.key === "ArrowDown") {
         e.preventDefault();
         setActiveSuggestionIndex((prev) =>
            prev < filteredSuggestions.length - 1 ? prev + 1 : prev
         );
      } else if (e.key === "ArrowUp") {
         e.preventDefault();
         setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === "Enter" && activeSuggestionIndex >= 0) {
         e.preventDefault();
         handleSuggestionClick(filteredSuggestions[activeSuggestionIndex]);
      } else if (e.key === "Escape") {
         setShowSuggestions(false);
         setActiveSuggestionIndex(-1);
      }
   };

   return (
      <div style={{ position: "relative", width: "100%" }}>
         {label && (
            <label htmlFor={id} className="auth-label">
               {label}
            </label>
         )}
         <input
            ref={inputRef}
            type="text"
            id={id}
            name={name}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={className}
            required={required}
            autoComplete="off"
         />
         {showSuggestions && filteredSuggestions.length > 0 && (
            <div
               ref={suggestionsRef}
               style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  background: "#ffffff",
                  border: "1px solid #d0d0d0",
                  borderRadius: "6px",
                  marginTop: "4px",
                  maxHeight: "200px",
                  overflowY: "auto",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  zIndex: 1000,
               }}
            >
               {filteredSuggestions.map((suggestion, index) => (
                  <div
                     key={index}
                     onClick={() => handleSuggestionClick(suggestion)}
                     style={{
                        padding: "10px 12px",
                        cursor: "pointer",
                        background:
                           index === activeSuggestionIndex ? "#f0f0f0" : "#ffffff",
                        color: "#333333",
                        fontSize: "0.9rem",
                        borderBottom:
                           index < filteredSuggestions.length - 1
                              ? "1px solid #e0e0e0"
                              : "none",
                     }}
                     onMouseEnter={() => setActiveSuggestionIndex(index)}
                  >
                     {suggestion}
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}
