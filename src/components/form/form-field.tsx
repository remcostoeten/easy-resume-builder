import type React from 'react';
import { forwardRef } from 'react';
import { Input, Label, Textarea } from 'ui';
import { cn } from 'utilities';
type TProps = {
	readonly label: string;
	readonly name: string;
	readonly type?: 'text' | 'email' | 'tel' | 'url' | 'textarea';
	readonly placeholder?: string;
	readonly error?: string;
	readonly hasError?: boolean;
	readonly required?: boolean;
	readonly className?: string;
};

export const FormField = forwardRef<HTMLInputElement | HTMLTextAreaElement, TProps>(
	function FormField(
		{ label, name, type = 'text', placeholder, error, hasError, required, className, ...props },
		ref
	) {
		const fieldId = `field-${name}`;
		const errorId = `${fieldId}-error`;

		return (
			<div className={cn('space-y-2', className)}>
				<Label
					htmlFor={fieldId}
					className={cn(
						'text-sm font-medium',
						required && "after:content-['*'] after:ml-0.5 after:text-destructive"
					)}
				>
					{label}
				</Label>

				{type === 'textarea' ? (
					<Textarea
						id={fieldId}
						name={name}
						placeholder={placeholder}
						className={cn(
							hasError && 'border-destructive focus-visible:ring-destructive'
						)}
						aria-invalid={hasError}
						aria-describedby={error ? errorId : undefined}
						ref={ref as React.Ref<HTMLTextAreaElement>}
						{...props}
					/>
				) : (
					<Input
						id={fieldId}
						name={name}
						type={type}
						placeholder={placeholder}
						className={cn(
							hasError && 'border-destructive focus-visible:ring-destructive'
						)}
						aria-invalid={hasError}
						aria-describedby={error ? errorId : undefined}
						ref={ref as React.Ref<HTMLInputElement>}
						{...props}
					/>
				)}

				{error && (
					<p id={errorId} className='text-sm text-destructive' role='alert'>
						{error}
					</p>
				)}
			</div>
		);
	}
);
