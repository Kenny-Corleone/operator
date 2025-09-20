import React, { useState } from 'react';
import { Download, Trash2 } from 'lucide-react';

const AdminFiles = () => {
    const [files, setFiles] = useState([]);

    const handleFileUpload = (event) => {
        const uploadedFile = event.target.files[0];
        if (uploadedFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newFile = {
                    name: uploadedFile.name,
                    url: e.target.result,
                    type: uploadedFile.type,
                };
                setFiles([...files, newFile]);
            };
            reader.readAsDataURL(uploadedFile);
        }
    };

    const removeFile = (fileName) => {
        setFiles(files.filter(f => f.name !== fileName));
    };

    return (
        <div>
            <input type="file" onChange={handleFileUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            <div className="mt-6 space-y-3">
                {files.length > 0 ? files.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                        <span>{file.name}</span>
                        <div>
                            <a href={file.url} download={file.name} className="inline-flex items-center gap-2 text-blue-600 hover:underline mr-4"><Download size={16}/> Скачать</a>
                            <button onClick={() => removeFile(file.name)} className="text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
                        </div>
                    </div>
                )) : <p className="text-gray-500">Файлы не загружены.</p>}
            </div>
        </div>
    );
};

export default AdminFiles;