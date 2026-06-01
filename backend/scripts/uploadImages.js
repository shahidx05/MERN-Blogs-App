const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const cloudinary = require('../config/cloudinary');

const uploadImages = async () => {
    try {
        const postsDir = path.join(__dirname, '../images/posts');
        const usersDir = path.join(__dirname, '../images/users');

        // Check if directories exist
        const postsFiles = await fs.readdir(postsDir);
        const usersFiles = await fs.readdir(usersDir);

        console.log(`Found ${postsFiles.length} post images and ${usersFiles.length} user images.`);

        const postImageUrls = [];
        const userImageUrls = [];

        console.log("Starting post images upload...");
        for (const file of postsFiles) {
            const filePath = path.join(postsDir, file);
            console.log(`Uploading post image: ${file}`);
            try {
                const result = await cloudinary.uploader.upload(filePath, {
                    folder: 'blogiary/posts',
                });
                postImageUrls.push(result.secure_url);
            } catch (err) {
                console.error(`Failed to upload ${file}:`, err.message);
            }
        }

        console.log("Starting user images upload...");
        for (const file of usersFiles) {
            const filePath = path.join(usersDir, file);
            console.log(`Uploading user image: ${file}`);
            try {
                const result = await cloudinary.uploader.upload(filePath, {
                    folder: 'blogiary/users',
                });
                userImageUrls.push(result.secure_url);
            } catch (err) {
                console.error(`Failed to upload ${file}:`, err.message);
            }
        }

        const postUrlsPath = path.join(__dirname, 'postImageUrls.json');
        const userUrlsPath = path.join(__dirname, 'userImageUrls.json');

        await fs.writeFile(postUrlsPath, JSON.stringify(postImageUrls, null, 2));
        await fs.writeFile(userUrlsPath, JSON.stringify(userImageUrls, null, 2));

        console.log('Upload complete. URLs saved to JSON files.');
    } catch (error) {
        console.error("Error during image upload:", error);
    }
};

uploadImages();
