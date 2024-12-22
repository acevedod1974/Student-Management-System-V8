/**
 *
 * Student Management System
 *
 * Description: The Student Management System is a comprehensive web application designed to manage student data efficiently.
 * Built with modern web technologies, this system offers a robust and user-friendly interface for managing courses, students, and their performance.
 *
 * Technologies Used:
 * - React
 * - TypeScript
 * - Zustand (State Management)
 * - Tailwind CSS (Styling)
 * - Vite (Building and Serving)
 *
 * Author: Daniel Acevedo Lopez
 * GitHub: https://github.com/acevedod1974/Student-Management-System-V4
 *
 * Copyright © 2023 Daniel Acevedo Lopez. All rights reserved.
 *
 * This project is licensed under the MIT License. See the LICENSE file for more details.
 */

import React, { useRef, useState } from "react";
import { Save, Database, Download } from "lucide-react";
import { useCourseStore } from "../store/useCourseStore";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import { BlobServiceClient } from "@azure/storage-blob";

const AZURE_STORAGE_CONNECTION_STRING = import.meta.env
  .VITE_AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = "backups";

export const DataManagement: React.FC = () => {
  const { exportData, importData } = useCourseStore();
  const { studentPasswords } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [backups, setBackups] = useState<string[]>([]);

  const handleExport = async () => {
    const courseData = exportData();
    const fullBackup = {
      courses: JSON.parse(courseData),
      studentPasswords,
      version: "1.0",
      timestamp: new Date().toISOString(),
    };

    try {
      await uploadToAzure(fullBackup);
      saveToLocal(fullBackup);
    } catch (error) {
      console.error("Error exporting backup:", error);
      toast.error("Error al exportar el backup");
    }
  };

  const uploadToAzure = async (backup: object) => {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      AZURE_STORAGE_CONNECTION_STRING
    );
    const containerClient =
      blobServiceClient.getContainerClient(CONTAINER_NAME);
    const blobName = `sistema-calificaciones-backup-${
      new Date().toISOString().split("T")[0]
    }.json`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const content = JSON.stringify(backup, null, 2);
    const uint8Array = new TextEncoder().encode(content);

    await blockBlobClient.upload(uint8Array, uint8Array.length);

    toast.success("Backup exportado a Azure Blob Storage exitosamente");
  };

  const saveToLocal = (backup: object) => {
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sistema-calificaciones-backup-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Backup exportado exitosamente");
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const backup = JSON.parse(content);

          if (!backup.courses || !backup.studentPasswords || !backup.version) {
            throw new Error("Formato de backup inválido");
          }

          importData(JSON.stringify(backup.courses));
          if (backup.studentPasswords) {
            useAuthStore.setState({
              studentPasswords: backup.studentPasswords,
            });
          }

          toast.success("Datos restaurados exitosamente");
        } catch (error) {
          console.error("Error importing backup:", error);
          toast.error("Error al importar el backup");
        }
      };
      reader.readAsText(file);
    }
  };

  const fetchBackups = async () => {
    try {
      const blobServiceClient = BlobServiceClient.fromConnectionString(
        AZURE_STORAGE_CONNECTION_STRING
      );
      const containerClient =
        blobServiceClient.getContainerClient(CONTAINER_NAME);
      const blobs = containerClient.listBlobsFlat();
      const backupList: string[] = [];
      for await (const blob of blobs) {
        backupList.push(blob.name);
      }
      backupList.sort().reverse();
      setBackups(backupList.slice(0, 6));
      toast.success("Backups fetched successfully");
    } catch (error) {
      console.error("Error fetching backups from Azure Blob Storage:", error);
      toast.error("Error fetching backups from Azure Blob Storage");
    }
  };

  const handleRetrieve = async (blobName: string) => {
    try {
      const blobServiceClient = BlobServiceClient.fromConnectionString(
        AZURE_STORAGE_CONNECTION_STRING
      );
      const containerClient =
        blobServiceClient.getContainerClient(CONTAINER_NAME);
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      const downloadBlockBlobResponse = await blockBlobClient.download(0);
      const blobBody = await downloadBlockBlobResponse.blobBody;
      const downloaded = await blobBody?.text();
      if (downloaded) {
        const backup = JSON.parse(downloaded);

        if (!backup.courses || !backup.studentPasswords || !backup.version) {
          throw new Error("Formato de backup inválido");
        }

        importData(JSON.stringify(backup.courses));
        if (backup.studentPasswords) {
          useAuthStore.setState({ studentPasswords: backup.studentPasswords });
        }

        toast.success("Datos restaurados exitosamente");
      }
    } catch (error) {
      console.error("Error retrieving backup from Azure Blob Storage:", error);
      toast.error("Error retrieving backup from Azure Blob Storage");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          title="Crear backup completo"
        >
          <Save className="w-4 h-4" />
          Backup
        </button>
        <label className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
          <Database className="w-4 h-4" />
          Restaurar
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </label>
        <button
          onClick={fetchBackups}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
          title="Fetch backups from Azure"
        >
          <Download className="w-4 h-4" />
          Fetch Backups
        </button>
      </div>
      {backups.length > 0 && (
        <div className="flex flex-col gap-2">
          {backups.map((backup) => (
            <button
              key={backup}
              onClick={() => handleRetrieve(backup)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700"
              title={`Retrieve ${backup}`}
            >
              <Download className="w-4 h-4" />
              {backup}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
