import { useState } from 'react';
import './App.css';
import UploadForm from './UploadForm';
import type { Tag } from './services/api';
import TagView from './TagView';

function App() {
    const [tags, setTags] = useState<Tag[]>();
    const [htmlText, setHtmlText] = useState<string>('');
    console.log(tags);

    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            {tags?.length ? (
                <TagView tags={tags} setTags={setTags} />
            ) : (
                <>
                <h1 className='text-4xl font-bold mb-2'>Let's Get Started</h1>
                <h2 className='text-2xl mb-6'>Upload an HTML file or paste code below</h2>
                <UploadForm setTags={setTags} htmlText={htmlText} setHtmlText={setHtmlText}/>
                </>
            )}
        </div>
    )
}

export default App;
