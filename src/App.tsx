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

import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Navigation } from "./components/Navigation";
import { Dashboard } from "./pages/Dashboard";
import { CoursePage } from "./pages/CoursePage";
import { StudentDetailsPage } from "./pages/StudentDetailsPage";
import LoginPage from "./components/LoginPage"; // Ensure correct import
import { BlobServiceClient } from "@azure/storage-blob";
import { useCourseStore } from "./store/useCourseStore";
import { useAuthStore } from "./store/useAuthStore";
import toast from "react-hot-toast";

const AZURE_STORAGE_CONNECTION_STRING =
  "BlobEndpoint=https://sms8.blob.core.windows.net/;QueueEndpoint=https://sms8.queue.core.windows.net/;FileEndpoint=https://sms8.file.core.windows.net/;TableEndpoint=https://sms8.table.core.windows.net/;SharedAccessSignature=sv=2022-11-02&ss=bfqt&srt=co&sp=rwdlacupiytfx&se=2025-01-21T07:24:03Z&st=2024-12-20T23:24:03Z&spr=https&sig=CRZFhnlOCRTp9MZs8JvT8YNpmn5Z8zxGs%2FC6NuOMhGQ%3D";
const CONTAINER_NAME = "backups";

const App: React.FC = () => {
  const { importData } = useCourseStore();
  const { setStudentPasswords } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [backupRestored, setBackupRestored] = useState(false);

  useEffect(() => {
    const fetchLatestBackup = async () => {
      if (backupRestored) return;

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
        const latestBackup = backupList[0];

        if (latestBackup) {
          const blockBlobClient =
            containerClient.getBlockBlobClient(latestBackup);
          const downloadBlockBlobResponse = await blockBlobClient.download(0);
          const blobBody = await downloadBlockBlobResponse.blobBody;
          const downloaded = await blobBody?.text();
          if (downloaded) {
            const backup = JSON.parse(downloaded);

            if (
              !backup.courses ||
              !backup.studentPasswords ||
              !backup.version
            ) {
              throw new Error("Formato de backup inválido");
            }

            importData(JSON.stringify(backup.courses));
            setStudentPasswords(backup.studentPasswords);
            toast.success(
              "Datos restaurados exitosamente desde el último backup"
            );
            setBackupRestored(true);
          }
        }
      } catch (error) {
        console.error(
          "Error retrieving backup from Azure Blob Storage:",
          error
        );
        toast.error("Error al recuperar el backup desde Azure Blob Storage");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBackup();
  }, [importData, setStudentPasswords, backupRestored]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Toaster />
      <Navigation />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/course/:courseId" element={<CoursePage />} />
        <Route
          path="/course/:courseId/student/:studentId"
          element={<StudentDetailsPage />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
