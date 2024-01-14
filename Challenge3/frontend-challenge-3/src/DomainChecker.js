// src/DomainChecker.js
import React, { useState } from 'react';

const DomainChecker = () => {
    const [domain, setDomain] = useState('');
    const [result, setResult] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:7331/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ command: domain }),
            });
            const data = await response.text();
            setResult(data);
        } catch (error) {
            console.error('Error:', error);
            setResult('Failed to fetch result');
        }
    };

    return (
        <div style={{position: 'absolute', top: '50%', left: '50%', transform: `translate(-50%, -50%)`}}>
            <h1>Domain Checker</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={domain} 
                    onChange={(e) => setDomain(e.target.value)} 
                    placeholder="Enter a domain e.g.: google.com" 
                />
                <button type="submit">Check</button>
            </form>
            {result && <p>Result: {result}</p>}
        </div>
    );
};

export default DomainChecker;
