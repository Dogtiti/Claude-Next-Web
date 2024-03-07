import { FC, memo } from 'react';
import RemarkMath from 'remark-math';
import RemarkGfm from 'remark-gfm';
import RehypeKatex from 'rehype-katex';
import ReactMarkdown, { Options } from 'react-markdown';
import CodeBlock from './codeBlock';

const Markdown = ({
	children,
	...restProps
}: {
	children?: string | null | undefined;
}) => {
	return (
		<ReactMarkdown
			{...restProps}
			remarkPlugins={[RemarkGfm, RemarkMath]}
			rehypePlugins={[RehypeKatex]}
			components={{
				code({ node, className, children, ...props }) {
					const match = /language-(\w+)/.exec(className || '');
					return match ? (
						<CodeBlock
							key={Math.random()}
							language={(match && match[1]) || ''}
							value={String(children).replace(/\n$/, '')}
							{...props}
						/>
					) : (
						<code className={className} {...props}>
							{children}
						</code>
					);
				},
				table({ children }) {
					return (
						<table className='border-collapse border border-black px-3 py-1 dark:border-white'>
							{children}
						</table>
					);
				},
				th({ children }) {
					return (
						<th className='break-words border border-black bg-gray-500 px-3 py-1 text-white dark:border-white'>
							{children}
						</th>
					);
				},
				td({ children }) {
					return (
						<td className='break-words border border-black px-3 py-1 dark:border-white'>
							{children}
						</td>
					);
				},
			}}
		>
			{children}
		</ReactMarkdown>
	);
};

const MemoizedReactMarkdown: FC<Options> = memo(
	Markdown,
	(prevProps, nextProps) => prevProps.children === nextProps.children
);

export default MemoizedReactMarkdown;
