export const Logo = () => (
	<svg
		width="40"
		height="40"
		viewBox="0 0 40 40"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<title>Social Media Aggregator</title>
		<rect width="40" height="40" rx="8" fill="url(#gradient)" />
		<path d="M20 8L28 12V20L20 24L12 20V12L20 8Z" fill="white" />
		<path d="M20 24V32" stroke="white" strokeWidth="2" strokeLinecap="round" />
		<path
			d="M28 20L32 22"
			stroke="white"
			strokeWidth="2"
			strokeLinecap="round"
		/>
		<path
			d="M12 20L8 22"
			stroke="white"
			strokeWidth="2"
			strokeLinecap="round"
		/>
		<circle cx="20" cy="20" r="4" fill="white" />
		<defs>
			<linearGradient
				id="gradient"
				x1="0"
				y1="0"
				x2="40"
				y2="40"
				gradientUnits="userSpaceOnUse"
			>
				<stop stopColor="#6366F1" />
				<stop offset="1" stopColor="#8B5CF6" />
			</linearGradient>
		</defs>
	</svg>
);
