import path from 'node:path';
import http from 'node:http';
import {fileURLToPath} from 'node:url';
import fs from 'node:fs/promises';
import getPort from 'get-port';
import serveHandler from 'serve-handler';
import {serve} from 'micro';
import {chromium} from 'playwright';
import type {AstroGlobal, AstroIntegration} from 'astro';
// For thumbnails processing
import fsExtra from 'fs-extra';
import sharp from 'sharp';

const screenshotFolder = './tmp/screenshots/';

type SelfieOptions = {
	screen?: {width: number; height: number};
	viewport?: {width: number; height: number};
};

export default function selfie(options: SelfieOptions = {}): AstroIntegration {
	const screen = options.screen ?? {width: 1024, height: 768};
	const viewport = options.viewport ?? {width: 1024, height: 768};
	let root: URL;
	return {
		name: 'astro-selfie-veeva',
		hooks: {
			// eslint-disable-next-line @typescript-eslint/naming-convention, object-shorthand
			'astro:config:done': ({config}) => {
				root = (config as unknown as {root: URL}).root;
			},
			// eslint-disable-next-line @typescript-eslint/naming-convention, object-shorthand
			'astro:build:done': async ({dir, pages}) => {
				const screenshotsDir = new URL(screenshotFolder, root);
				await fs.mkdir(fileURLToPath(screenshotsDir), {recursive: true});
				const port = await getPort();
				const baseUrl = new URL(`http://localhost:${port}`);

				const server = new http.Server(
					serve(async (request, response) => {
						await serveHandler(request, response, {
							public: fileURLToPath(dir),
						});
					}),
				);

				server.listen(port);
				const browser = await chromium.launch();
				const context = await browser.newContext({
					screen,
					viewport,
				});
				for (const {pathname} of pages) {
					const url = new URL(pathname, baseUrl);
					const page = await context.newPage();
					await page.goto(url.href);
					// Wait for 3 seconds
					await page.waitForTimeout(3000);
					await page.evaluate('document.body.dataset.astroSelfie = true;');
					const screenshot = await page.screenshot({type: 'png'});
					const screenshotPath = path.join(
						fileURLToPath(screenshotsDir),
						pathname === '' ? 'index.png' : `${pathname}.png`,
					);

					await fs.mkdir(path.dirname(screenshotPath), {recursive: true});
					await fs.writeFile(screenshotPath, screenshot);
				}

				await browser.close();
				server.close();

				// Process screenshots into Veeva thumbnails

				// Empty current thumbnail directory
				fsExtra.emptyDirSync('./thumbnails');

				// Get list of all the files in `screenshotFolder`
				const getImages = (source: string) => fsExtra.readdirSync(source);

				const images = getImages(screenshotFolder);

				// Process screenshots into thumbnails
				for (const image of images) {
					await sharp(screenshotFolder + image)
						.resize({width: 1024, height: 768})
						.toFile('./thumbnails/' + path.parse(image).name + '-full.png');

					await sharp(screenshotFolder + image)
						.resize({width: 200, height: 150})
						.toFile('./thumbnails/' + path.parse(image).name + '-thumb.jpg');
				}
			},
		},
	};
}
