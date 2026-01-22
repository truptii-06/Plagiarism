import React, { useState } from 'react';
import { Upload, FileCode, CheckCircle, AlertTriangle, Loader2, BarChart3, Fingerprint } from 'lucide-react';
import './PlagiarismTools.css';

const CodePlagiarism = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setResult(null);
            setError('');
        }
        // Reset input value so same file can be selected again if needed
        e.target.value = null;
    };

    const runCheck = async () => {
        if (!file) return;
        setLoading(true);
        setError('');
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);

        const endpoint = 'http://localhost:5000/api/plagiarism/code-similarity';

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || `Server error: ${res.status}`);
            }

            const data = await res.json();

            if (data.success && data.result) {
                setResult(data.result);
            } else {
                setError(data.error || 'Analysis failed. Please try again.');
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err.message || 'Server connection error.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tool-container">
            <div className="tool-header">
                <h2>Code Plagiarism Analysis</h2>
                <p>Verify code authenticity through structural similarity check.</p>
            </div>

            <div className="check-card">
                <div className={`upload-area ${file ? 'active' : ''}`} style={{ position: 'relative' }}>
                    <input
                        type="file"
                        className="hidden-input"
                        onChange={handleFileChange}
                        accept=".py,.java,.js,.cpp,.c"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            opacity: 0,
                            cursor: 'pointer',
                            zIndex: 10
                        }}
                    />

                    <div style={{ pointerEvents: 'none' }}>
                        <div className="icon-wrapper">
                            {file ? <FileCode size={48} className="upload-icon" /> : <Upload size={48} className="upload-icon" />}
                        </div>

                        <div className="upload-text">
                            {file ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <span className="file-name">{file.name}</span>
                                    <span style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>Click to change file</span>
                                </div>
                            ) : (
                                <span>Click or Drag to Upload Code File (Python, Java, JS, C++)</span>
                            )}
                        </div>
                    </div>
                </div>

                <button
                    className={`analyze-btn ${loading ? 'analyzing-pulse' : ''}`}
                    onClick={runCheck}
                    disabled={!file || loading}
                    style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: '10px',
                        border: 'none',
                        background: '#007bff',
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        marginTop: '20px'
                    }}
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} /> Analyzing...
                        </>
                    ) : (
                        'Compare Similarity'
                    )}
                </button>

                {error && <div className="error-msg" style={{ color: '#ff4757', marginTop: '15px', textAlign: 'center' }}>{error}</div>}
            </div>

            {result && (
                <div className={`result-section ${result.similarity > 30 ? 'ai-detected' : 'human-detected'}`} style={{ marginTop: '20px' }}>
                    <div className="result-header">
                        <div className="result-icon">
                            {result.similarity > 30 ? <AlertTriangle size={24} /> : <CheckCircle size={24} />}
                        </div>
                        <div className="result-title">
                            {result.similarity > 30 ? 'Similarity Detected' : 'No Significant Plagiarism'}
                        </div>
                    </div>

                    <div className="confidence-meter">
                        <div className="meter-label">
                            <span>Overall Similarity Score</span>
                            <span>{result.similarity}%</span>
                        </div>
                        <div className="progress-track" style={{ background: '#eee', height: '10px', borderRadius: '5px' }}>
                            <div className="progress-fill" style={{
                                width: `${Math.min(result.similarity, 100)}%`,
                                height: '100%',
                                borderRadius: '5px',
                                background: result.similarity > 50 ? '#f43f5e' : (result.similarity > 30 ? '#fbbf24' : '#10b981')
                            }}></div>
                        </div>
                    </div>

                    <div className="result-details" style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
                        <div className="detail-card" style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <h4 style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Most Similar File</h4>
                            <p style={{ margin: 0, fontWeight: '600', color: '#334155' }}>{result.most_similar_doc || "None"}</p>
                        </div>
                        <div className="detail-card" style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <h4 style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Lexical Score</h4>
                            <p style={{ margin: 0, fontWeight: '600', color: '#0ea5e9' }}>{result.lexical_similarity || 0}%</p>
                        </div>
                        <div className="detail-card" style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <h4 style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Structural Score</h4>
                            <p style={{ margin: 0, fontWeight: '600', color: '#8b5cf6' }}>{result.structural_similarity || 0}%</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CodePlagiarism;
