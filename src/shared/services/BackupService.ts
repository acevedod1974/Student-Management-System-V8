/**
 * Backup Service
 *
 * Handles backup and restore operations using various storage providers
 */
import { BlobServiceClient } from "@azure/storage-blob";
import { supabase } from "../../utils/supabaseClient";
import { Course } from "../../features/courses/types";

// Constants
const CONTAINER_NAME = "backups";
const AZURE_CONNECTION_STRING = import.meta.env
  .VITE_AZURE_STORAGE_CONNECTION_STRING;

// Types for backups
export interface Backup {
  version: string;
  courses: Course[];
  studentPasswords?: Record<string, string>;
  createdAt: string;
}

export interface BackupOptions {
  includePasswords?: boolean;
}

/**
 * Service for handling data backup and restore operations
 */
export class BackupService {
  private azureBlobServiceClient: BlobServiceClient;

  constructor() {
    // Initialize Azure blob service if connection string is available
    if (AZURE_CONNECTION_STRING) {
      this.azureBlobServiceClient = BlobServiceClient.fromConnectionString(
        AZURE_CONNECTION_STRING
      );
    }
  }

  /**
   * Create a backup with the current data
   */
  createBackup(
    courses: Course[],
    studentPasswords?: Record<string, string>
  ): Backup {
    return {
      version: "1.0",
      courses,
      studentPasswords,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Export backup to file
   */
  exportToFile(backup: Backup): string {
    return JSON.stringify(backup, null, 2);
  }

  /**
   * Save backup to Azure Blob Storage
   */
  async saveToAzure(backup: Backup): Promise<string> {
    if (!AZURE_CONNECTION_STRING) {
      throw new Error("Azure Storage connection string not configured");
    }

    try {
      // Get container client
      const containerClient =
        this.azureBlobServiceClient.getContainerClient(CONTAINER_NAME);

      // Create container if it doesn't exist
      await containerClient.createIfNotExists();

      // Create a blob name with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const blobName = `backup-${timestamp}.json`;

      // Get a block blob client
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      // Upload backup data
      const backupData = this.exportToFile(backup);
      await blockBlobClient.upload(backupData, backupData.length);

      return blobName;
    } catch (error) {
      console.error("Error saving backup to Azure:", error);
      throw new Error("Failed to save backup to Azure");
    }
  }

  /**
   * Save backup to Supabase
   */
  async saveToSupabase(backup: Backup): Promise<string> {
    try {
      const { data, error } = await supabase
        .from("backups")
        .insert({
          data: backup,
          createdAt: new Date().toISOString(),
        })
        .select("id");

      if (error) throw error;
      return data?.[0]?.id;
    } catch (error) {
      console.error("Error saving backup to Supabase:", error);
      throw new Error("Failed to save backup to Supabase");
    }
  }

  /**
   * List backups from Azure Blob Storage
   */
  async listAzureBackups(): Promise<string[]> {
    if (!AZURE_CONNECTION_STRING) {
      throw new Error("Azure Storage connection string not configured");
    }

    try {
      // Get container client
      const containerClient =
        this.azureBlobServiceClient.getContainerClient(CONTAINER_NAME);

      // List blobs
      const blobs = containerClient.listBlobsFlat();
      const backupList: string[] = [];

      for await (const blob of blobs) {
        backupList.push(blob.name);
      }

      // Sort by most recent first
      return backupList.sort().reverse();
    } catch (error) {
      console.error("Error listing backups from Azure:", error);
      throw new Error("Failed to list backups from Azure");
    }
  }

  /**
   * Retrieve backup from Azure Blob Storage
   */
  async retrieveFromAzure(blobName: string): Promise<Backup> {
    if (!AZURE_CONNECTION_STRING) {
      throw new Error("Azure Storage connection string not configured");
    }

    try {
      // Get container client
      const containerClient =
        this.azureBlobServiceClient.getContainerClient(CONTAINER_NAME);

      // Get block blob client
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      // Download the blob
      const downloadResponse = await blockBlobClient.download(0);
      const downloadedContent = await this.streamToString(
        downloadResponse.readableStreamBody!
      );

      return JSON.parse(downloadedContent) as Backup;
    } catch (error) {
      console.error("Error retrieving backup from Azure:", error);
      throw new Error("Failed to retrieve backup from Azure");
    }
  }

  /**
   * Helper method to convert stream to string
   */
  private async streamToString(
    readableStream: NodeJS.ReadableStream
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const chunks: string[] = [];
      readableStream.on("data", (data) => {
        chunks.push(data.toString());
      });
      readableStream.on("end", () => {
        resolve(chunks.join(""));
      });
      readableStream.on("error", reject);
    });
  }
}
