import fsExtra from 'fs-extra';
import path from 'node:path';
import sharp from "sharp";

export async function processThumbnails(distPath: string) {
    // Empty current thumbnail directory
    fsExtra.emptyDirSync('./thumbnails');

    // Get list of all the files in `distPath`
    const getImages = (source : string) =>
    fsExtra.readdirSync(source)

    const images = getImages(distPath)

    // Process screenshots into thumbnails
    images.forEach((image) => {

    sharp(distPath + image)
        .resize({ width: 1024, height: 768 })
        .toFile("./thumbnails/" + path.parse(image).name + "-full.png")

    sharp(distPath + image)
        .resize({ width: 200, height: 150 })
        .toFile("./thumbnails/" + path.parse(image).name + "-thumb.jpg");
    })
}