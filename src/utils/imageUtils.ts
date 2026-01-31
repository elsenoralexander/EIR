import imageCompression from 'browser-image-compression';

export async function compressImage(file: File): Promise<File> {
    const options = {
        maxSizeMB: 1, // Max size 1MB as requested
        maxWidthOrHeight: 1920, // Standard HD max
        useWebWorker: true,
        initialQuality: 0.8
    };

    try {
        const compressedBlob = await imageCompression(file, options);
        // Convert Blob back to File to maintain metadata if possible
        return new File([compressedBlob], file.name, {
            type: compressedBlob.type,
            lastModified: Date.now(),
        });
    } catch (error) {
        console.error('Error compressing image:', error);
        return file; // Fallback to original if compression fails
    }
}

export async function compressImages(files: FileList | File[]): Promise<File[]> {
    const fileArray = Array.from(files);
    return Promise.all(fileArray.map(file => compressImage(file)));
}
