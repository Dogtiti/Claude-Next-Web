import MemoizedReactMarkdown from '@/components/markdown';
import Actions from './actions';
import { motion } from 'framer-motion';
import NextImage from 'next/image';
import { IconUser } from '@tabler/icons-react';

const Messages = ({
	messages = [],
	onRegenerate,
	streaming = false,
}: {
	messages: Message[];
	onRegenerate: () => void;
	streaming: boolean;
}) => {
	const handleClick = () => {};

	return (
		<div className='flex-1 flex flex-col gap-3 px-4 pt-16'>
			{messages.map((item, i) => {
				if (item.role === 'user') {
					return <UserMessage key={i} content={item.content} />;
				}

				return (
					<RobotMessage
						key={i}
						content={item.content}
						isfinalCompletion={i === messages.length - 1}
						onRegenerate={onRegenerate}
					/>
				);
			})}
			{messages.length > 0 && (
				<div className='transition-transform duration-300 ease-out ml-1 mt-0.5 flex items-center'>
					<motion.div
						className='p-1 select-none w-10 h-10'
						onClick={handleClick}
						animate={{
							scale: streaming ? [1, 0.8, 1] : 1, // 当streaming为true时，循环“收缩”效果，否则保持正常大小
						}}
						transition={{
							duration: 0.5,
							repeat: streaming ? Infinity : 0, // 当streaming为true时，无限循环动画
						}}
					>
						<NextImage
							src='/images/claude.png'
							className='w-full h-full'
							alt=''
						/>
					</motion.div>
					{!streaming && (
						<div className='flex-1 text-right text-text-400 text-[0.65rem] sm:text-[0.75rem] leading-[0.85rem] tracking-tighter mt-2.5'>
							<span className='inline-block transition-opacity opacity-100 duration-700'>
								Claude can make mistakes.
								<br className='block sm:hidden' />
								Please double-check responses.
							</span>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

const UserMessage = ({ content }: { content: string }) => {
	return (
		<div className='mt-4'>
			<div className='inline-flex gap-2 bg-gradient-to-b from-bg-claude-300 rounded-xl ml-px pl-2.5 pr-6 py-2 break-words text-text-200 transition-all max-w-full flex-col'>
				<div className='flex flex-row gap-2'>
					<div className='shrink-0'>
						<IconUser size={30} />
					</div>
					<div className='font-claude-user-message py-0.5 min-h-12 grid grid-cols-1 gap-2 leading-6 text-[0.9375rem]'>
						<MemoizedReactMarkdown className='flex-1 max-w-full text-text-200'>
							{content}
						</MemoizedReactMarkdown>
					</div>
				</div>
			</div>
		</div>
	);
};

const RobotMessage = ({
	content,
	onRegenerate,
	isfinalCompletion,
}: {
	content: string;
	onRegenerate: () => void;
	isfinalCompletion?: boolean;
}) => {
	return (
		<div className='robot group pt-3.5 pb-[1.125rem] px-4 relative rounded-2xl -tracking-[0.015em]'>
			<div className='font-claude-robot-message grid grid-cols-1 gap-3 pr-9 relative'>
				<MemoizedReactMarkdown className='flex-1 max-w-full text-text-200'>
					{content}
				</MemoizedReactMarkdown>
			</div>
			<Actions
				content={content}
				isfinalCompletion={isfinalCompletion}
				onRegenerate={onRegenerate}
			/>
		</div>
	);
};

export default Messages;
