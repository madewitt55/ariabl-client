import type { Tag } from './services/api';
import HtmlTag from './HtmlTag';
import './TagView.css';

export function flattenTags(tags: Tag[]): Tag[] {
    return tags.flatMap(tag => [tag, ...flattenTags(tag.content.filter((c): c is Tag => typeof c !== 'string'))]);
}
export function hasErrors(tags: Tag[]): boolean {
    return flattenTags(tags).some(t => t.error && t.error !== 'NOT_SELF_CLOSING');
}
export function hasWarnings(tags: Tag[]): boolean {
    return !hasErrors(tags) && flattenTags(tags).some(t => t.error === 'NOT_SELF_CLOSING');
}

function TagView(props: { 
    tags: Tag[],
    setTags: (tags: Tag[]) => void
}) {
    const errors = hasErrors(props.tags);
    const warnings = hasWarnings(props.tags);

    return (
        <div className='flex flex-row items-center w-full flex-1 min-h-0 pb-8'>
            <div className='flex-1'/>
            <div className='tag-view flex flex-col w-[60vw] h-full rounded-2xl shadow-xl p-8 overflow-y-auto'>
                <div className='flex flex-col gap-1 pb-8'>
                    {props.tags.map((rootTag: Tag) => (
                        <HtmlTag key={rootTag.id} tag={rootTag} />
                    ))}
                </div>
            </div>
            <div className='flex-1 flex items-center justify-center'>
                <div className='action-panel flex flex-col gap-2 p-4 rounded-2xl'>
                    <button
                        disabled={errors}
                        className={`rounded-lg px-6 py-3 font-medium text-lg transition-colors
                            ${errors
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                                : warnings
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
    );
}

export default TagView;
