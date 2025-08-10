import Image from 'next/image';

export default function ImageTestPage() {
	return (
		<div>
			<h1>Image Optimization Test</h1>

			<h2>JPEG Image</h2>
			<Image src='/placeholder.jpg' alt='Placeholder JPG' width={500} height={300} />

			<h2>PNG Image</h2>
			<Image src='/placeholder-logo.png' alt='Placeholder PNG' width={200} height={200} />

			<h2>JPG User Image</h2>
			<Image src='/placeholder-user.jpg' alt='Placeholder User' width={150} height={150} />
		</div>
	);
}
