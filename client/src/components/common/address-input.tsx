import { forwardRef } from 'react';
import { Input } from '@/components/ui/input';

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  autoFocus?: boolean;
}

export const AddressInput = forwardRef<HTMLInputElement, AddressInputProps>(
  ({ value, onChange, placeholder = "Enter property address", className = "", disabled = false, required = false, autoFocus = false }, ref) => {
    return (
      <Input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
        disabled={disabled}
        required={required}
        autoFocus={autoFocus}
        autoComplete="street-address"
      />
    );
  }
);

AddressInput.displayName = 'AddressInput';