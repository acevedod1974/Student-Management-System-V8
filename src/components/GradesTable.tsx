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

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Save, X, Plus, Edit2 } from 'lucide-react';
import { Course } from '../types/course';
import { useCourseStore } from '../store/useCourseStore';
import toast from 'react-hot-toast';

interface GradesTableProps {
  course: Course;
  onDeleteStudent: (studentId: string) => void;
}

export const GradesTable: React.FC<GradesTableProps> = ({ course, onDeleteStudent }) => {
  const { updateGrade, updateExamName, addExam, deleteExam } = useCourseStore();
  const [editingCell, setEditingCell] = useState<{
    studentId: string;
    gradeId: string;
    currentValue: number;
  } | null>(null);
  const [editingExam, setEditingExam] = useState<{
    index: number;
    name: string;
  } | null>(null);
  const [newExamName, setNewExamName] = useState('');
  const [showAddExam, setShowAddExam] = useState(false);

  const handleEditStart = (studentId: string, gradeId: string, currentValue: number) => {
    setEditingCell({ studentId, gradeId, currentValue });
  };

  const handleEditSave = () => {
    if (!editingCell) return;

    const newScore = Number(editingCell.currentValue);
    if (isNaN(newScore) || newScore < 0 || newScore > 100) {
      toast.error('La calificación debe ser un número entre 0 y 100');
      return;
    }
    updateGrade(course.id, editingCell.studentId, editingCell.gradeId, newScore);
    setEditingCell(null);
    toast.success('Calificación actualizada');
  };

  const handleExamEditSave = () => {
    if (!editingExam) return;
    if (!editingExam.name.trim()) {
      toast.error('El nombre del examen no puede estar vacío');
      return;
    }
    updateExamName(course.id, editingExam.index, editingExam.name);
    setEditingExam(null);
    toast.success('Nombre del examen actualizado');
  };

  const handleAddExam = () => {
    if (!newExamName.trim()) {
      toast.error('El nombre del examen no puede estar vacío');
      return;
    }
    addExam(course.id, newExamName);
    setNewExamName('');
    setShowAddExam(false);
    toast.success('Examen agregado exitosamente');
  };

  const handleDeleteExam = (index: number) => {
    if (window.confirm('¿Está seguro de eliminar este examen? Esta acción no se puede deshacer.')) {
      deleteExam(course.id, index);
      toast.success('Examen eliminado exitosamente');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, type: 'grade' | 'exam' | 'new') => {
    if (e.key === 'Enter') {
      if (type === 'grade') {
        handleEditSave();
      } else if (type === 'exam') {
        handleExamEditSave();
      } else {
        handleAddExam();
      }
    } else if (e.key === 'Escape') {
      if (type === 'grade') {
        setEditingCell(null);
      } else if (type === 'exam') {
        setEditingExam(null);
      } else {
        setShowAddExam(false);
        setNewExamName('');
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estudiante
            </th>
            {course.exams.map((exam, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <div className="flex items-center gap-2">
                  {editingExam?.index === index ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editingExam.name}
                        onChange={(e) => setEditingExam({ ...editingExam, name: e.target.value })}
                        onKeyDown={(e) => handleKeyPress(e, 'exam')}
                        className="w-32 px-2 py-1 text-xs border rounded"
                        autoFocus
                      />
                      <button
                        onClick={handleExamEditSave}
                        className="p-1 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingExam(null)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span>{exam}</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setEditingExam({ index, name: exam })}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteExam(index)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {course.students.map((student) => (
            <tr key={student.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <Link
                  to={`/course/${course.id}/student/${student.id}`}
                  className="font-medium text-gray-900 hover:text-blue-600"
                >
                  {student.firstName} {student.lastName}
                </Link>
                <div className="text-sm text-gray-500">{student.email}</div>
              </td>
              {student.grades.map((grade) => (
                <td
                  key={grade.id}
                  className="px-6 py-4 whitespace-nowrap text-gray-900"
                >
                  {editingCell?.studentId === student.id && editingCell?.gradeId === grade.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={editingCell.currentValue}
                        onChange={(e) => setEditingCell({
                          ...editingCell,
                          currentValue: Number(e.target.value)
                        })}
                        onKeyDown={(e) => handleKeyPress(e, 'grade')}
                        className="w-20 px-2 py-1 border rounded"
                        autoFocus
                      />
                      <button
                        onClick={handleEditSave}
                        className="p-1 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingCell(null)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`inline-block px-3 py-1 rounded-full cursor-pointer transition-colors ${
                        grade.score >= 50
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                      onClick={() => handleEditStart(student.id, grade.id, grade.score)}
                    >
                      {grade.score}
                    </div>
                  )}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-block px-3 py-1 rounded-full font-semibold ${
                  student.finalGrade >= 250
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {student.finalGrade}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => onDeleteStudent(student.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        {showAddExam ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newExamName}
              onChange={(e) => setNewExamName(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, 'new')}
              placeholder="Nombre del nuevo examen"
              className="px-3 py-2 border rounded-md"
              autoFocus
            />
            <button
              onClick={handleAddExam}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              Agregar
            </button>
            <button
              onClick={() => {
                setShowAddExam(false);
                setNewExamName('');
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAddExam(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Agregar Examen
          </button>
        )}
      </div>
    </div>
  );
};