export interface ImgBBResponse {
    url: string;
    thumbUrl: string;
}

export async function uploadToImgBB(file: File): Promise<ImgBBResponse> {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
        throw new Error('La API Key de ImgBB no está configurada.');
    }

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error?.message || 'Error al subir la imagen a ImgBB');
    }

    return {
        url: data.data.url,
        thumbUrl: data.data.medium?.url || data.data.display_url || data.data.thumb.url
    };
}
