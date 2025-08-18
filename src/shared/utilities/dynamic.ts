import dynamic from 'next/dynamic';
import type { ComponentType, ReactNode } from 'react';
import { createElement } from 'react';

function toLoadingRenderer(
	Loading?: ComponentType
): ((loadingProps: any) => ReactNode) | undefined {
	if (!Loading) return undefined;
	function render() {
		if (!Loading) return null;
		return createElement(Loading as ComponentType);
	}
	return render;
}

export function dynamicClient<T>(loader: () => Promise<T>, loading?: ComponentType) {
	return dynamic(loader as never, { ssr: false, loading: toLoadingRenderer(loading) });
}
