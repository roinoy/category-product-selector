const { fileURLToPath } = require("url");
const { dirname, join, relative, extname } = require("path");
const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const fs = require("fs");

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

const client = new S3Client({});

const getContentType = (filePath) => {
  const ext = extname(filePath).toLowerCase();
  switch (ext) {
    case ".html":
      return "text/html";
    case ".css":
      return "text/css";
    case ".js":
      return "application/javascript";
    case ".png":
      return "image/png";
    case ".jpeg":
    case ".jpg":
      return "image/jpeg";
    case ".svg":
      return "image/svg+xml";
    // Add more cases for other file types as needed
    default:
      return "application/octet-stream"; // Default to binary data if content type is unknown
  }
};

const uploadDirectory = async (directoryPath, bucketName, parentFolder = "") => {
  const items = fs.readdirSync(directoryPath);
  for (const item of items) {
    const itemPath = join(directoryPath, item);
    const itemStats = fs.statSync(itemPath);
    let key = join(parentFolder, item);
    key = key.replace(/\\/g, '/')

    if (itemStats.isFile()) {
      const fileContent = fs.readFileSync(itemPath);
      const contentType = getContentType(itemPath);
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: fileContent,
        ContentType: contentType, // Set Content-Type based on file extension
      });

      try {
        const response = await client.send(command);
        console.log(`Uploaded: ${key}`);
      } catch (err) {
        console.error(`Failed to upload ${key}: ${err.message}`);
      }
    } else if (itemStats.isDirectory()) {
      // Recursively upload files from subdirectory
      await uploadDirectory(itemPath, bucketName, key);
    }
  }
};

const main = async () => {
  const directoryPath = join(__dirname, "build"); // Path to the local 'build' directory
  const bucketName = "my-react-test-app-products-order"; // Your S3 bucket name

  await uploadDirectory(directoryPath, bucketName);
};

main();
