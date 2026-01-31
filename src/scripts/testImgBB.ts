async function testImgBB() {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    console.log('Testing ImgBB API Key:', apiKey ? 'FOUND' : 'MISSING');

    if (!apiKey) {
        console.error('Error: NEXT_PUBLIC_IMGBB_API_KEY is not set in .env.local');
        return;
    }

    try {
        const formData = new FormData();
        // A tiny 1x1 transparent pixel in base64
        const base64Image = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        formData.append('image', base64Image);

        console.log('Attempting to upload test pixel to ImgBB...');
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        if (response.ok) {
            console.log('✅ Success! Image URL:', data.data.url);
        } else {
            console.error('❌ Failed:', data.error?.message || 'Unknown error');
        }
    } catch (error) {
        console.error('❌ Exception:', error);
    }
}

testImgBB();
