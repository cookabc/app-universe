export function compressImage(imageDataUrl, targetWidth, targetHeight) {
    return new Promise((resolve) => {
        const image = new Image();
        image.src = imageDataUrl;

        image.onload = () => {
            if (!targetHeight && targetWidth) {
                const ratio = image.width / image.height
                targetHeight = targetHeight || targetWidth / ratio
            }
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            ctx.clearRect(0, 0, targetWidth, targetHeight);
            ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
            const compressedImageDataUrl = canvas.toDataURL('image/jpeg', 0.7); // 0.7 表示压缩质量，可以根据需要调整
            // 清理临时Canvas
            canvas.remove();
            resolve(compressedImageDataUrl);
        };
    });
}
