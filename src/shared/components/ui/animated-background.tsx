// CSS-only AnimatedBackground component
// Uses AnimatedBackground.css for animations and optional mouse parallax

import './AnimatedBackground.css';

export function AnimatedBackground() {
	return (
		<div className='animated-bg'>
			{Array.from({ length: 20 }).map((_, i) => (
				<div key={i} className='dot' />
			))}
		</div>
	);
}
