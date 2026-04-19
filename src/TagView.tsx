import type { Tag } from './services/api';
import HtmlTag from './HtmlTag';
import './TagView.css';

export function flattenTags(tags: Tag[]): Tag[] {
    return tags.flatMap(tag => [tag, ...flattenTags(tag.content.filter((c): c is Tag => typeof c !== 'string'))]);
}

function TagView(props: {
    tags: Tag[],
    setHeading: (heading: string) => void,
    setSubheading: (subheading: string) => void,
}) {
    return (
        <div className='tag-view flex flex-col flex-1 overflow-y-auto h-full'>
            <div className='flex flex-col gap-1 pb-8'>
                {props.tags.map((rootTag: Tag) => (
                    <HtmlTag key={rootTag.id} tag={rootTag} />
                ))}
            </div>
        </div>
    );
}

export default TagView;
