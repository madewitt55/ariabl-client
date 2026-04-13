import type { Tag } from './services/api';
import HtmlTag from './HtmlTag';
import './TagView.css';

function flattenTags(tags: Tag[]): Tag[] {
    return tags.flatMap(tag => [tag, ...flattenTags(tag.children ?? [])]);
}

function TagView(props: { 
    tags: Tag[],
    setTags: (tags: Tag[]) => void
}) {
    const allTags = flattenTags(props.tags);
    const hasErrors = allTags.some(t => t.error && t.error !== 'NOT_SELF_CLOSING');
    const hasWarnings = !hasErrors && allTags.some(t => t.error === 'NOT_SELF_CLOSING');

    const heading = hasErrors ? 'Your code has some issues'
        : hasWarnings ? 'Your code could use a few tweaks'
        : 'Your code looks solid';

    const subheading = hasErrors ? "Let's resolve them"
        : hasWarnings ? "Consider making a few changes"
        : "Let's optimize it";

    return (
        <>
            <h1 className='text-4xl font-bold mb-2'>{heading}</h1>
            <h2 className='text-2xl mb-6'>{subheading}</h2>
            <div className='flex flex-row items-center w-screen'>
                <div className='flex-1'/>
                <div className='tag-view flex flex-col w-[60vw] h-[80vh] rounded-2xl shadow-xl p-8 overflow-y-auto'>
                    <div className='flex flex-col gap-1 pb-8'>
                        {props.tags.map((rootTag: Tag) => (
                            <HtmlTag key={rootTag.id} tag={rootTag} />
                        ))}
                    </div>
                </div>
                <div className='flex-1 flex items-center justify-center'>
                    <div className='action-panel flex flex-col gap-2 p-4 rounded-2xl'>
                        <button
                            disabled={hasErrors}
                            className={`rounded-lg px-6 py-3 font-medium text-lg transition-colors
                                ${hasErrors
                                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                                    : hasWarnings
                                        ? 'bg-yellow-600 hover:bg-yellow-700 cursor-pointer text-white'
                                        : 'bg-green-600 hover:bg-green-700 cursor-pointer text-white'
                                }`}
                        >Optimize</button>
                        <button 
                            className='upload-button rounded-lg px-6 py-3 cursor-pointer font-medium text-lg'
                            onClick={() => props.setTags([])}
                        >
                            Edit Code
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default TagView;
