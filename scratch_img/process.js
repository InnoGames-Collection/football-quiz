const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');

const inputDir = path.join(__dirname, '../dist/assets/animation');
const outputDir = path.join(__dirname, '../public/assets/animation');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function processImages() {
    const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.png'));
    
    for (const file of files) {
        console.log(`Processing ${file}...`);
        try {
            const image = await Jimp.read(path.join(inputDir, file));
            
            image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
                const red   = this.bitmap.data[idx + 0];
                const green = this.bitmap.data[idx + 1];
                const blue  = this.bitmap.data[idx + 2];
                if (red < 15 && green < 15 && blue < 15) {
                    this.bitmap.data[idx + 3] = 0;
                }
            });
            
            const baseName = file.replace('.png.png', '.png');
            await image.writeAsync(path.join(outputDir, baseName));
            console.log(`Saved ${baseName} (${image.bitmap.width}x${image.bitmap.height})`);
        } catch (e) {
            console.error(`Error processing ${file}:`, e);
        }
    }
}

processImages();
