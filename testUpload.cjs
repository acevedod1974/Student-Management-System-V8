const { BlobServiceClient } = require("@azure/storage-blob");

const AZURE_STORAGE_CONNECTION_STRING =
  "BlobEndpoint=https://sms8.blob.core.windows.net/;QueueEndpoint=https://sms8.queue.core.windows.net/;FileEndpoint=https://sms8.file.core.windows.net/;TableEndpoint=https://sms8.table.core.windows.net/;SharedAccessSignature=sv=2022-11-02&ss=bfqt&srt=co&sp=rwdlacupiytfx&se=2025-01-21T07:24:03Z&st=2024-12-20T23:24:03Z&spr=https&sig=CRZFhnlOCRTp9MZs8JvT8YNpmn5Z8zxGs%2FC6NuOMhGQ%3D";
const CONTAINER_NAME = "backups";

async function testUpload() {
  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      AZURE_STORAGE_CONNECTION_STRING
    );
    const containerClient =
      blobServiceClient.getContainerClient(CONTAINER_NAME);
    const blobName = `test-upload-${
      new Date().toISOString().split("T")[0]
    }.txt`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const content = "This is a test upload.";
    const uploadBlobResponse = await blockBlobClient.upload(
      content,
      content.length
    );

    console.log(
      `Test upload successful. Request ID: ${uploadBlobResponse.requestId}`
    );
  } catch (error) {
    console.error("Error during test upload:", error.message);
  }
}

testUpload();
