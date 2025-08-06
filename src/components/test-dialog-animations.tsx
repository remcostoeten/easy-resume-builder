'use client';

import { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/shared/components/ui/dialog';

export function TestDialogAnimations() {
	const [open, setOpen] = useState(false);

	return (
		<div className="p-8 space-y-4">
			<h2 className="text-2xl font-bold">Dialog Animation Test</h2>
			
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<button
						type="button"
						className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
					>
						Open Animated Dialog
					</button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Animated Dialog Test</DialogTitle>
						<DialogDescription>
							This dialog should animate in with a smooth fade-in, scale-up, and slide-down effect.
							The overlay should also blur in gradually.
						</DialogDescription>
					</DialogHeader>
					
					<div className="py-4">
						<p className="text-sm text-muted-foreground mb-4">
							Animation features being tested:
						</p>
						<ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
							<li>Overlay fade-in with backdrop blur (0px → 4px)</li>
							<li>Dialog container scale animation (0.9 → 1.0)</li>
							<li>Dialog container slide animation (y: 30 → 0)</li>
							<li>Dialog container opacity (0 → 1)</li>
							<li>Exit animations when closed</li>
							<li>AnimatePresence with mode="wait" for proper unmounting</li>
						</ul>
					</div>

					<DialogFooter>
						<button
							type="button"
							onClick={function handleClose() {
								setOpen(false);
							}}
							className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
						>
							Close (Test Exit Animation)
						</button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
