const sharp = require('sharp');

module.exports = function resize(readStream, width, height) {
    let transform = sharp();
    if (width || height) {
        transform = transform.resize(width, height);
    }
    return readStream.pipe(transform);
};
