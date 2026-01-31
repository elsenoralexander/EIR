import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";

// Testing both bucket formats
const BUCKETS = [
    "eir-goddes.firebasestorage.app",
    "eir-goddes.appspot.com"
];

const config = {
    apiKey: "AIzaSyDJ_GXcWDKJibdHgH5U1AojFUh0Jf2GzNA",
    authDomain: "eir-goddes.firebaseapp.com",
    projectId: "eir-goddes",
    messagingSenderId: "115772008630",
    appId: "1:115772008630:web:2a022c2ae417fd3b6fde17",
};

async function testBucket(bucketName: string) {
    console.log(`\n--- Testing Bucket: ${bucketName} ---`);
    try {
        const app = initializeApp({ ...config, storageBucket: bucketName }, bucketName); // Unique app name per bucket
        const storage = getStorage(app);
        const storageRef = ref(storage, 'test/diagnosis_string.txt');

        console.log('Attempting uploadString...');
        await uploadString(storageRef, "Hello World", 'raw');
        console.log(`✅ Success for ${bucketName}!`);

        const url = await getDownloadURL(storageRef);
        console.log(`✅ Download URL: ${url}`);
        return true;
    } catch (error: any) {
        console.error(`❌ Failed for ${bucketName}:`);
        console.log('Error Code:', error.code);
        console.log('Error Message:', error.message);
        if (error.serverResponse) {
            console.log('Server Response:', error.serverResponse);
        }
        // Try to stringify the whole thing if possible
        try {
            console.log('Full Error JSON:', JSON.stringify(error, null, 2));
        } catch (e) {
            console.log('Full Error Object Keys:', Object.keys(error));
        }
        return false;
    }
}

async function run() {
    for (const bucket of BUCKETS) {
        await testBucket(bucket);
    }
}

run();
