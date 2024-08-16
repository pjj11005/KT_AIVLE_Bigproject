declare module 'react-tagcloud' {
  export interface Tag {
    value: string;
    count: number;
  }

  export interface TagCloudProps {
    minSize: number;
    maxSize: number;
    tags: Tag[];
    colorOptions?: object;
    onClick?: (tag: Tag) => void;
    renderer?: (tag: Tag, size: number, color: string) => JSX.Element;
  }

  export const TagCloud: React.FC<TagCloudProps>;
}
