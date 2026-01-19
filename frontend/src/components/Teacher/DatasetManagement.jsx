import React, { useState, useEffect } from "react";
import { Upload, Trash2, FileSpreadsheet, Package, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import "./DatasetManagement.css";

const DatasetManagement = () => {
    const [datasets, setDatasets] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState(null);

    const teacherId = localStorage.getItem("userId");

    const fetchDatasets = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/datasets?teacherId=${teacherId}`);
            const data = await res.json();
            setDatasets(data);
        } catch (err) {
            console.error("Failed to fetch datasets", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDatasets();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !name) return;

        setUploading(true);
        setMessage(null);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("name", name);
        formData.append("teacherId", teacherId);

        try {
            const res = await fetch("http://localhost:5000/api/datasets/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            if (data.success) {
                setMessage({ type: "success", text: "Dataset uploaded and processed successfully!" });
                setName("");
                setFile(null);
                fetchDatasets();
            } else {
                setMessage({ type: "error", text: data.error || "Upload failed" });
            }
        } catch (err) {
            setMessage({ type: "error", text: "Server error during upload" });
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this dataset? This will remove all records used for plagiarism comparison.")) return;

        try {
            const res = await fetch(`http://localhost:5000/api/datasets/${id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.success) {
                setDatasets(datasets.filter((d) => d._id !== id));
            }
        } catch (err) {
            alert("Failed to delete dataset");
        }
    };

    return (
        <div className="dataset-mgmt-container">
            <div className="dataset-header">
                <h1>Reference Datasets</h1>
                <p>Upload CSV or Excel files containing previous students' work or reference material to compare against new submissions.</p>
            </div>

            <div className="dataset-grid">
                <div className="upload-section panel">
                    <h3>Upload New Dataset</h3>
                    <form onSubmit={handleUpload}>
                        <div className="form-group">
                            <label>Dataset Name (e.g. "Batch 2023 Projects")</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter a descriptive name"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Select File (CSV or XLSX)</label>
                            <div className="file-drop-zone">
                                <input
                                    type="file"
                                    accept=".csv, .xlsx, .xls"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    id="dataset-file"
                                />
                                <label htmlFor="dataset-file" className="file-label">
                                    <Upload size={24} />
                                    <span>{file ? file.name : "Choose a file or drag it here"}</span>
                                </label>
                            </div>
                        </div>
                        <button type="submit" className="btn primary wide" disabled={uploading}>
                            {uploading ? (
                                <><Loader2 className="spinner" size={18} /> Processing...</>
                            ) : (
                                "Upload and Process"
                            )}
                        </button>
                    </form>

                    {message && (
                        <div className={`message-banner ${message.type}`}>
                            {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                            <span>{message.text}</span>
                        </div>
                    )}
                </div>

                <div className="list-section panel">
                    <h3>Current Datasets</h3>
                    {loading ? (
                        <div className="loading-state"><Loader2 className="spinner" /> Loading datasets...</div>
                    ) : datasets.length === 0 ? (
                        <div className="empty-state">
                            <Package size={48} />
                            <p>No datasets uploaded yet.</p>
                        </div>
                    ) : (
                        <div className="dataset-list">
                            {datasets.map((ds) => (
                                <div key={ds._id} className="dataset-item">
                                    <div className="ds-icon">
                                        <FileSpreadsheet size={24} />
                                    </div>
                                    <div className="ds-info">
                                        <h4>{ds.name}</h4>
                                        <p>{ds.rowCount} records found • {new Date(ds.uploadDate).toLocaleDateString()}</p>
                                    </div>
                                    <button className="delete-btn" onClick={() => handleDelete(ds._id)}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DatasetManagement;
