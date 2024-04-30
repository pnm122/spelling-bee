import * as esbuild from 'esbuild';

try {
	await esbuild.build({
		entryPoints: ['src/index.ts'],
		bundle: true,
		sourcemap: false,
		minify: true,
		platform: 'node',
		target: ['node18.6'],
		packages: 'external',
		outfile: 'dist/index.js'
	});

	console.log('Server bundled successfully for production!');
} catch (error) {
	console.error('An error occurred during bundling:', error);
	process.exit(1);
}