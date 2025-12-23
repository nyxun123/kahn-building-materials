
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, '../public/logo-k.svg');
const publicDir = path.join(__dirname, '../public');

async function generate() {
    console.log('Generating favicons from:', source);

    // 1. Generate ICO (32x32 for legacy) - actually we'll just make a 32x32 png and rename/use it or use a library. 
    // Sharp doesn't output .ico directly easily without plugins, but browsers support png favicons well. 
    // For .ico, we can resize to 32x32 and save as png, then manually rename or just keep using png in link tags. 
    // However, `favicon.ico` is special. Let's make a 32x32 png for it.

    // 1. Generate ICO (32x32) as favicon-v8.ico
    await sharp(source)
        .resize(32, 32)
        .toFile(path.join(publicDir, 'favicon.ico'));
    // Also create v8 version
    await sharp(source)
        .resize(32, 32)
        .toFile(path.join(publicDir, 'favicon-v8.ico'));

    // 2. Generate PNGs with v8 suffix
    const sizes = [48, 96, 144, 192];
    for (const size of sizes) {
        await sharp(source)
            .resize(size, size)
            .toFile(path.join(publicDir, `favicon-${size}x${size}-v8.png`));
        console.log(`Generated favicon-${size}x${size}-v8.png`);
    }

    // 3. Apple Touch Icon (180x180) -> apple-touch-icon-v8.png
    // Apple touch icons usually look better with a white background if the logo is transparent, 
    // but let's stick to transparent for consistency unless requested otherwise.
    await sharp(source)
        .resize(180, 180)
        .toFile(path.join(publicDir, 'apple-touch-icon-v8.png'));
    console.log('Generated apple-touch-icon-v8.png');

    // 4. Generate standard favicon.png as fallback
    await sharp(source)
        .resize(32, 32)
        .toFile(path.join(publicDir, 'favicon-v8.png'));
}

generate().catch(err => console.error(err));
