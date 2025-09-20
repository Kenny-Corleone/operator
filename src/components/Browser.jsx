import React from 'react';

const Browser = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[70vh]">
        <iframe src="https://www.google.com/search?igu=1" className="w-full h-full border rounded-lg"></iframe>
        <iframe src="https://www.google.com/search?igu=1" className="w-full h-full border rounded-lg"></iframe>
    </div>
);

export default Browser;