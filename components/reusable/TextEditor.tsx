'use client';

import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface RichTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextarea = ({ value, onChange, placeholder }: RichTextareaProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Simple formatting shortcuts
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onChange(value + '\n');
    }
  };

  return (
    <div className="space-y-2">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="min-h-[120px]"
      />
    </div>
  );
};

export default RichTextarea;