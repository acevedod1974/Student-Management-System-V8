import React, { useRef, useState } from "react";
import { Save, Database, Download } from "lucide-react";
import { useCourseStore } from "../store/useCourseStore";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import { BlobServiceClient } from "@azure/storage-blob";
import { supabase } from "../utils/supabaseClient";
import { Course, Student, Backup, BackupVersion } from "../types";

const AZURE_STORAGE_CONNECTION_STRING = import.meta.env
  .VITE_AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = "backups";

export const DataManagement: React.FC = () => {
  const { exportData, importData } = useCourseStore();
  const { studentPasswords } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [backups, setBackups] = useState<string[]>([]);

  const handleExportToAzure = async () => {
    const courseData = exportData();
    const parsedCourses = JSON.parse(courseData) as Course[];

    // Calculate course averages
    const coursesWithAverages = parsedCourses.map((course: Course) => {
      const courseAverage =
        course.students.reduce(
          (acc: number, student: Student) => acc + student.finalGrade,
          0
        ) / course.students.length;

      return {
        ...course,
        courseAverage: Number(courseAverage.toFixed(1)),
      };
    });

    const fullBackup: Backup = {
      courses: coursesWithAverages,
      studentPasswords,
      version: "1.0" as BackupVersion,
      timestamp: new Date().toISOString(),
    };

    // Export to Azure
    try {
      const blobServiceClient = BlobServiceClient.fromConnectionString(
        AZURE_STORAGE_CONNECTION_STRING
      );
      const containerClient =
        blobServiceClient.getContainerClient(CONTAINER_NAME);
      const blockBlobClient = containerClient.getBlockBlobClient(
        `backup-${Date.now()}.json`
      );
      await blockBlobClient.upload(
        JSON.stringify(fullBackup),
        JSON.stringify(fullBackup).length
      );
      toast.success("Backup exportado a Azure exitosamente");
    } catch (error) {
      console.error("Error exporting backup to Azure:", error);
      toast.error("Error exporting backup to Azure");
    }
  };

  const handleExportToSupabase = async () => {
    const courseData = exportData();
    const parsedCourses = JSON.parse(courseData) as Course[];

    // Calculate course averages
    const coursesWithAverages = parsedCourses.map((course: Course) => {
      const courseAverage =
        course.students.reduce(
          (acc: number, student: Student) => acc + student.finalGrade,
          0
        ) / course.students.length;

      return {
        ...course,
        courseAverage: Number(courseAverage.toFixed(1)),
      };
    });

    const fullBackup: Backup = {
      courses: coursesWithAverages,
      studentPasswords,
      version: "1.0" as BackupVersion,
      timestamp: new Date().toISOString(),
    };

    // Export to Supabase
    await backupToSupabase(fullBackup);
  };

  const backupToSupabase = async (backup: Backup) => {
    try {
      console.log("Starting backup to Supabase...");
      const { error } = await supabase.from("backups").insert([
        {
          backup_data: backup,
          timestamp: new Date(),
        },
      ]);

      if (error) throw error;

      console.log("Backup to Supabase successful");
      toast.success("Backup exportado a Supabase exitosamente");
    } catch (error) {
      console.error("Error exporting backup to Supabase:", error);
      toast.error("Error exporting backup to Supabase");
    }
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
          onClick={handleExportToAzure}
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
        <button
          onClick={handleExportToSupabase}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700"
          title="Exportar Backup a Supabase"
        >
          <Download className="w-4 h-4" />
          Exportar Backup a Supabase
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

export default DataManagement;
