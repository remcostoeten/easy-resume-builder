'use client';

import React from 'react';
import { PersistedInput } from '@/components/ui/persisted-input';

/**
 * Demo component showing how localStorage persistence works
 */
export function PersistedFormDemo() {
	return (
		<div className="max-w-2xl mx-auto p-6 space-y-6">
			<div className="text-center">
				<h2 className="text-2xl font-bold mb-2">Form Persistence Demo</h2>
				<p className="text-gray-600">
					Type in the fields below, then refresh the page to see your data persist!
				</p>
			</div>
			
			<div className="bg-white rounded-lg border p-6 space-y-4">
				<h3 className="text-lg font-semibold mb-4">Personal Information</h3>
				
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							First Name
						</label>
						<PersistedInput
							formKey="demo-personal-info"
							fieldName="firstName"
							placeholder="Enter your first name"
							className="w-full"
						/>
					</div>
					
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Last Name
						</label>
						<PersistedInput
							formKey="demo-personal-info"
							fieldName="lastName"
							placeholder="Enter your last name"
							className="w-full"
						/>
					</div>
				</div>
				
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Email
					</label>
					<PersistedInput
						formKey="demo-personal-info"
						fieldName="email"
						type="email"
						placeholder="Enter your email"
						className="w-full"
					/>
				</div>
				
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Phone
					</label>
					<PersistedInput
						formKey="demo-personal-info"
						fieldName="phone"
						type="tel"
						placeholder="Enter your phone number"
						className="w-full"
					/>
				</div>
				
				<div className="pt-4 border-t">
					<p className="text-sm text-gray-500">
						💡 <strong>Tip:</strong> Your input is automatically saved to localStorage as you type. 
						Try refreshing the page to see it persist!
					</p>
				</div>
			</div>
			
			<div className="bg-blue-50 rounded-lg border border-blue-200 p-6 space-y-4">
				<h3 className="text-lg font-semibold mb-4 text-blue-800">Work Experience</h3>
				
				<div>
					<label className="block text-sm font-medium text-blue-700 mb-1">
						Job Title
					</label>
					<PersistedInput
						formKey="demo-work-experience"
						fieldName="jobTitle"
						placeholder="e.g. Senior Software Engineer"
						className="w-full"
						saveImmediately={true}
					/>
				</div>
				
				<div>
					<label className="block text-sm font-medium text-blue-700 mb-1">
						Company
					</label>
					<PersistedInput
						formKey="demo-work-experience"
						fieldName="company"
						placeholder="e.g. Google"
						className="w-full"
						saveImmediately={true}
					/>
				</div>
				
				<div className="pt-4 border-t border-blue-200">
					<p className="text-sm text-blue-600">
						⚡ <strong>Immediate Save:</strong> These fields save immediately without debouncing.
					</p>
				</div>
			</div>
			
			<div className="bg-gray-50 rounded-lg p-4 text-center">
				<p className="text-sm text-gray-600">
					Check your browser's localStorage to see the stored data:
				</p>
				<code className="text-xs bg-gray-200 px-2 py-1 rounded mt-2 inline-block">
					DevTools → Application → Local Storage → {typeof window !== 'undefined' ? window.location.origin : 'your-domain'}
				</code>
			</div>
		</div>
	);
}
