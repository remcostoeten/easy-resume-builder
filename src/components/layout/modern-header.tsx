'use client';

import { motion } from 'framer-motion';
import { Sparkles, Download, Eye, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProgressRing } from '../ui/progress-ring';

type TProps = {
	readonly progress: number;
	readonly currentStep: string;
	readonly onPreview: () =9e void;
	readonly onDownload: () =9e void;
	readonly onSettings: () =9e void;
};

export function ModernHeader({
	progress,
	currentStep,
	onPreview,
	onDownload,
	onSettings,
}: TProps) {
	return (
		<motion.header
			className="relative border-b border-white/10 bg-gradient-to-r from-slate-900/95 via-blue-900/95 to-purple-900/95 backdrop-blur-xl"
			initial={{ y: -100, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ type: 'spring', stiffness: 300, damping: 30 }}
		>
			<div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />

			<div className="relative px-6 py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-6">
						<motion.div
							className="flex items-center gap-3"
							whileHover={{ scale: 1.05 }}
						>
							<div className="relative">
								<Sparkles className="h-8 w-8 text-blue-400" />
								<motion.div
									className="absolute inset-0"
									animate={{ rotate: 360 }}
									transition={{
										duration: 8,
										repeat: Number.POSITIVE_INFINITY,
										ease: 'linear',
									}}
								>
									<Sparkles className="h-8 w-8 text-purple-400 opacity-50" />
								</motion.div>
							</div>
							<div>
								<h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
									Resume Builder
								</h1>
								<p className="text-sm text-muted-foreground">
									Create your perfect resume
								</p>
							</div>
						</motion.div>

						<div className="hidden md:flex items-center gap-4">
							<ProgressRing progress={progress} size={60} strokeWidth={4} />
							<div>
								<p className="text-sm font-medium text-white">{currentStep}</p>
								<p className="text-xs text-muted-foreground">Current section</p>
							</div>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<Button
							variant="ghost"
							size="sm"
							onClick={onPreview}
							className="text-white hover:bg-white/10 hover:text-blue-400 transition-all duration-200"
						>
							<Eye className="h-4 w-4 mr-2" />
							Preview
						</Button>

						<Button
							variant="ghost"
							size="sm"
							onClick={onSettings}
							className="text-white hover:bg-white/10 hover:text-purple-400 transition-all duration-200"
						>
							<Settings className="h-4 w-4 mr-2" />
							Settings
						</Button>

						<Button
							onClick={onDownload}
							className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
						>
							<Download className="h-4 w-4 mr-2" />
							Download
						</Button>
					</div>
				</div>
			</div>
		</motion.header>
	);
}
