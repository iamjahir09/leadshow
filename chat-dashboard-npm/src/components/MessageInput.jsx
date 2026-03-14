import { useState } from "react";

export default function MessageInput({ onSend, disabled }) {
  const [value, setValue] = useState("");

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  function submit() {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue("");
  }

  return (
    <div className="p-4 border-t border-slate-700 bg-slate-900">
      <div className="flex items-end gap-3">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
          rows={2}
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-400 outline-none focus:border-blue-600 resize-none transition-colors scrollbar-thin"
        />
        <button
          onClick={submit}
          disabled={!value.trim() || disabled}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm transition-colors"
        >
          {disabled ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
            </span>
          ) : (
            "Send"
          )}
        </button>
      </div>
    </div>
  );
}
