import React from 'react';
import { ScanText, Clock } from 'lucide-react';
import './PlagiarismTools.css';

const TextPlagiarism = () => {
    return (
        <div className="tool-container">
            <div className="tool-header">
                <h2>Text Plagiarism Analysis</h2>
                <p>Advanced document similarity and AI content detection for textual reports.</p>
            </div>

            <div className="check-card" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 20px',
                background: '#f8fafc',
                border: '2px dashed #cbd5e1',
                borderRadius: '16px'
            }}>
                <div style={{
                    background: '#e2e8f0',
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px'
                }}>
                    <Clock size={35} color="#64748b" />
                </div>

                <h3 style={{ margin: '0 0 10px 0', color: '#334155' }}>Coming Soon</h3>
                <p style={{
                    margin: 0,
                    color: '#64748b',
                    textAlign: 'center',
                    maxWidth: '400px',
                    lineHeight: '1.6'
                }}>
                    The Text Plagiarism analysis feature is currently under maintenance.
                    It will be available for student use in the next update.
                </p>

                <div style={{ marginTop: '30px' }}>
                    <span style={{
                        padding: '8px 16px',
                        background: '#f1f5f9',
                        borderRadius: '20px',
                        fontSize: '13px',
                        color: '#475569',
                        fontWeight: '500'
                    }}>
                        <ScanText size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                        Version 2.0 Feature
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TextPlagiarism;
