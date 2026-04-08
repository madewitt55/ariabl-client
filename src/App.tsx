import { useEffect, useState } from 'react';
import './App.css';
import UploadForm from './UploadForm';
import type { Tag } from './services/api';

function App() {
    const [tags, setTags] = useState<Tag[]>();

    useEffect(() => {
        if (!tags) return; 
        console.log(tags);
    }, [tags]);

    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            <h1 className='text-4xl font-bold mb-2'>Let's Get Started</h1>
            <h2 className='text-2xl mb-6'>Upload an HTML file or paste it below</h2>
            <UploadForm setTags={setTags}/>
        </div>
    )
}

export default App;
