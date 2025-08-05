'use client';

import { cn } from '@/shared/utilities';

type TSkeletonProps = {
	readonly className?: string;
};

export function Skeleton({ className }: TSkeletonProps) {
	return (
		<div
			className={cn(
				'animate-pulse rounded-md bg-muted',
				className
			)}
		/>
	);
}

type TSkeletonFactoryProps = {
	readonly className?: string;
	readonly animate?: boolean;
};

export function createSkeletonFactory() {
	function SkeletonText({ 
		className, 
		animate = true 
	}: TSkeletonFactoryProps) {
		return (
			<div
				className={cn(
					'h-4 rounded-md bg-muted',
					animate && 'animate-pulse',
					className
				)}
			/>
		);
	}

	function SkeletonTitle({ 
		className, 
		animate = true 
	}: TSkeletonFactoryProps) {
		return (
			<div
				className={cn(
					'h-6 rounded-md bg-muted',
					animate && 'animate-pulse',
					className
				)}
			/>
		);
	}

	function SkeletonButton({ 
		className, 
		animate = true 
	}: TSkeletonFactoryProps) {
		return (
			<div
				className={cn(
					'h-10 rounded-md bg-muted',
					animate && 'animate-pulse',
					className
				)}
			/>
		);
	}

	function SkeletonInput({ 
		className, 
		animate = true 
	}: TSkeletonFactoryProps) {
		return (
			<div
				className={cn(
					'h-10 rounded-md bg-muted border',
					animate && 'animate-pulse',
					className
				)}
			/>
		);
	}

	function SkeletonTextarea({ 
		className, 
		animate = true 
	}: TSkeletonFactoryProps) {
		return (
			<div
				className={cn(
					'h-24 rounded-md bg-muted border',
					animate && 'animate-pulse',
					className
				)}
			/>
		);
	}

	function SkeletonCard({ 
		className, 
		animate = true 
	}: TSkeletonFactoryProps) {
		return (
			<div
				className={cn(
					'rounded-lg border bg-card p-6',
					animate && 'animate-pulse',
					className
				)}
			/>
		);
	}

	function SkeletonIcon({ 
		className, 
		animate = true 
	}: TSkeletonFactoryProps) {
		return (
			<div
				className={cn(
					'h-5 w-5 rounded bg-muted',
					animate && 'animate-pulse',
					className
				)}
			/>
		);
	}

	function SkeletonBadge({ 
		className, 
		animate = true 
	}: TSkeletonFactoryProps) {
		return (
			<div
				className={cn(
					'h-6 w-16 rounded-full bg-muted',
					animate && 'animate-pulse',
					className
				)}
			/>
		);
	}

	function SkeletonAvatar({ 
		className, 
		animate = true 
	}: TSkeletonFactoryProps) {
		return (
			<div
				className={cn(
					'h-10 w-10 rounded-full bg-muted',
					animate && 'animate-pulse',
					className
				)}
			/>
		);
	}

	return {
		SkeletonText,
		SkeletonTitle,
		SkeletonButton,
		SkeletonInput,
		SkeletonTextarea,
		SkeletonCard,
		SkeletonIcon,
		SkeletonBadge,
		SkeletonAvatar,
	};
}

export const {
	SkeletonText,
	SkeletonTitle,
	SkeletonButton,
	SkeletonInput,
	SkeletonTextarea,
	SkeletonCard,
	SkeletonIcon,
	SkeletonBadge,
	SkeletonAvatar,
} = createSkeletonFactory();
