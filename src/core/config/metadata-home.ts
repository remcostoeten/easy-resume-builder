import type { Metadata } from 'next';
import { siteConfig } from './site-config';

export const metadata: Metadata = {
	title: siteConfig.name,
	description: siteConfig.description,
	generator: 'easy-resume-builder.com',
};
