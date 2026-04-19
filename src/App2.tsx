import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import type { Tag } from './services/api';
import TagView, { flattenTags } from './TagView';
import './App.css';

type CheckStatus = 'idle' | 'running' | 'passed' | 'failed';

const CHECKS: string[] = [
    'Image Alt Text',
    'Form Label Association',
    'Heading Hierarchy',
    'ARIA Landmark Roles',
];

function App2() {
    const { state } = useLocation();
    const [code, setCode] = useState<string>(state?.code ?? '')
    const [tags, setTags] = useState<Tag[]>(state?.tags ?? [])
    const [heading, setHeading] = useState<string>('Optimization');
    const [subheading, setSubheading] = useState<string>("Let's work on your code's accessibility.");
    const [statuses, setStatuses] = useState<Record<string, CheckStatus>>(
        Object.fromEntries(CHECKS.map((c) => [c, 'idle']))
    );
    const [checkTags, setCheckTags] = useState<Record<string, Tag[]>>({});

    const flat = flattenTags(tags);
    const checkDisabled: Record<string, boolean> = {
        'Image Alt Text': !flat.some(t => t.tagName === 'img'),
        'Form Label Association': !flat.some(t => ['input', 'select', 'textarea'].includes(t.tagName)),
        'Heading Hierarchy': false,
        'ARIA Landmark Roles': false,
    };

    return (
        <div className='flex flex-col items-center h-screen overflow-hidden pt-8 pb-8'>
            <h1 className='text-4xl font-bold mb-2'>{heading}</h1>
            {subheading && <h2 className='text-2xl mb-4'>{subheading}</h2>}

            <div className='flex flex-row flex-1 min-h-0 gap-6 pb-8 w-full px-8'>
                <div className='card rounded-2xl shadow-xl p-8 flex flex-col flex-1 min-h-0'>
                    <TagView tags={tags} setHeading={setHeading} setSubheading={setSubheading} />
                </div>

                <div className='card rounded-2xl shadow-xl p-8 flex flex-col flex-1 min-h-0 gap-3'>
                    {CHECKS.map((check) => {
                        const status = statuses[check];
                        return (
                            <div key={check} className={`flex flex-col px-6 py-5 rounded-lg bg-gray-700 gap-3 transition-opacity ${checkDisabled[check] ? 'opacity-40 pointer-events-none' : ''}`}>
                                <div className='flex flex-row items-center'>
                                    <span className='font-medium text-lg flex-1'>{check}</span>
                                    <div className={`w-4 h-4 rounded-full ${
                                        status === 'passed' ? 'bg-green-500' :
                                        status === 'failed' ? 'bg-red-500' :
                                        'bg-gray-500'
                                    }`} />
                                </div>
                                <div className='w-full h-2 rounded-full bg-gray-600 overflow-hidden'>
                                    <div className={`h-full rounded-full transition-all duration-500 ${
                                        status === 'passed' ? 'w-full bg-green-500' :
                                        status === 'failed' ? 'w-full bg-red-500' :
                                        status === 'running' ? 'w-1/2 bg-blue-400 animate-pulse' :
                                        'w-0'
                                    }`} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default App2;
