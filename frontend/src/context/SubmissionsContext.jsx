// src/context/SubmissionsContext.jsx
import React, { createContext, useEffect, useState } from 'react';

export const SubmissionsContext = createContext();

const STORAGE_KEY = 'plagix_submissions_v1';

export const SubmissionsProvider = ({ children }) => {
  const [submissions, setSubmissions] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error('Failed to parse submissions from localStorage:', err);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
    } catch (err) {
      console.error('Failed to save submissions to localStorage:', err);
    }
  }, [submissions]);

  const addSubmission = (submission) => {
    setSubmissions((prev) => [
      { ...submission, id: Date.now().toString() },
      ...prev,
    ]);
  };

  const updateSubmission = (id, patch) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...patch } : s))
    );
  };

  const removeSubmission = (id) => {
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <SubmissionsContext.Provider
      value={{ submissions, addSubmission, updateSubmission, removeSubmission }}
    >
      {children}
    </SubmissionsContext.Provider>
  );
};
