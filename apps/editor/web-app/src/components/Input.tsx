import { forwardRef, useId } from 'react';
import { tv } from 'tailwind-variants';

import { Label } from './Label';

const input = tv({
  base: 'inline-flex flex-col space-y-2',

  slots: {
    label: '',
    input: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    helperText: '',
  },

  variants: {
    error: {
      true: {
        input: 'border-red-500',
        helperText: 'text-red-500',
      }
    }
  },
});

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, classes, label, id: propsId, helperText, error, ...props }, ref) => {
  const generatedId = useId();
  const id = propsId || generatedId;
  const styles = input({ error });

  return (
    <span className={styles.base({ className })}>
      {label && (
        <Label
          htmlFor={id}
          className={styles.label({ className: classes?.label })}
        >
          {label}
        </Label>
      )}

      <input
        id={id}
        className={styles.input({ className: classes?.input })}
        ref={ref}
        {...props}
      />

      {helperText && (
        <span
          className={styles.helperText({ className: classes?.helperText })}
        >
          {helperText}
        </span>
      )}
    </span>
  );
});

Input.displayName = 'Input';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: boolean;
  classes?: Partial<Record<'label' | 'input' | 'helperText', string>>;
}
