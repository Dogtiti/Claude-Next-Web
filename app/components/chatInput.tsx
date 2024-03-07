import { IconPaperclip } from '@tabler/icons-react';
import {
	useRef,
	useEffect,
	useState,
	KeyboardEvent,
	ChangeEvent,
	ForwardedRef,
	forwardRef,
	useImperativeHandle,
} from 'react';
import IconSend from '@/images/send.svg';
import classnames from 'classnames';
import { motion } from 'framer-motion';

const ChatInput = forwardRef<
	ForwardedRef<HTMLTextAreaElement>,
	{
		onSend: (message: { role: 'user'; content: string }) => void;
		streaming: boolean;
	}
>(({ onSend, streaming }, ref) => {
	const uploadRef = useRef<HTMLInputElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(
		null as unknown as HTMLTextAreaElement
	);
	const [isTyping, setIsTyping] = useState<boolean>(false);
	const [content, setContent] = useState<string>('');
	const [uploadFile, setUploadFile] = useState<{
		name: string;
		url: string;
	}>({ name: '', url: '' });
	const [uploading, setUploading] = useState(false);

	useImperativeHandle(ref, () => textareaRef.current);

	const handleUploadChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target;
		handleUpload(files as unknown as File[], () => {
			e.target.value = '';
		});
	};

	const handleClickUpload = () => {
		uploadRef.current?.click();
	};

	useEffect(() => {
		if (textareaRef?.current) {
			textareaRef.current.style.height = 'inherit';
			textareaRef.current.style.height = `${textareaRef.current?.scrollHeight}px`;
			textareaRef.current.style.overflow = `${
				textareaRef.current?.scrollHeight > 400 ? 'auto' : 'hidden'
			}`;
		}
	}, [content]);

	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		const value = e.target.value;
		setContent(value);
	};

	const handleSend = () => {
		if (streaming) {
			return;
		}

		if (!content && !uploadFile?.url) {
			window.alert('Please enter a message');
			return;
		}

		onSend({
			role: 'user',
			content: uploadFile?.url
				? `${formatFileName(uploadFile)} ${content}`
				: content,
		});
		setContent('');
		setUploadFile({ name: '', url: '' });
		if (window.innerWidth < 640 && textareaRef && textareaRef.current) {
			textareaRef.current.blur();
		}
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (!isTyping && e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	const handleUpload = async (files: File[] = [], cb?: () => void) => {
		if (uploading) return;
		try {
			setUploading(true);
			const formData = new FormData();
			formData.append('file', files?.[0]);
			// const { data } = await axios.post('/api/upload', formData); // TODO
			// setUploadFile({ url: data, name: files?.[0].name });
			// setUploading(false);
			cb?.();
		} catch (error) {
			console.error(error);
			setUploading(false);
		}
	};
	return (
		<div className='w-full sticky bottom-0 mx-auto'>
			<div className='relative z-10'>
				<fieldset
					className='bg-white rounded-t-2xl border-t-0.5 border-x-0.5 border-border-300 pl-3.5 sm:pl-5 pr-2.5 pb-2 sm:pb-3 mt-6 -mx-1 sm:mx-0 flex items-start transition-all focus-within:border-border-200 relative z-[5]'
					style={{
						boxShadow:
							'0 0.25rem 1.25rem rgba(0, 0, 0, 0.05), 0 0 0.75rem 0.5rem #f4f3ee',
					}}
				>
					<div className='flex flex-col flex-1'>
						<div className='flex items-start gap-4'>
							<div className='flex-1'>
								<div className='overflow-y-auto w-full max-h-96 break-words py-4'>
									<textarea
										ref={textareaRef}
										value={content}
										className={classnames(
											'focus:outline-none w-full resize-none border-0 bg-transparent overflow-visible h-auto max-h-[400px]',
											{
												bottom: `${textareaRef?.current?.scrollHeight}px`,
												overflow: `${
													textareaRef?.current
														?.scrollHeight > 400
														? 'auto'
														: 'hidden'
												}`,
											}
										)}
										placeholder={'Replay to Claude...'}
										rows={1}
										onChange={handleChange}
										onKeyDown={handleKeyDown}
										autoFocus
										onCompositionStart={() =>
											setIsTyping(true)
										}
										onCompositionEnd={() =>
											setIsTyping(false)
										}
									/>
								</div>
							</div>
							<div className='grid grid-flow-col items-center mt-3'>
								<div className='mr-1.5 h-8 w-8'>
									<button
										onClick={handleClickUpload}
										className='rounded-lg p-1 bg-200 w-8 h-8 flex-center hover:bg-400'
									>
										<input
											ref={uploadRef}
											type='file'
											hidden
											onChange={handleUploadChange}
										/>
										<IconPaperclip size={18} />
									</button>
								</div>
								<div>
									{content.length > 0 && (
										<motion.button
											className='rounded-lg p-1 bg-accent-main-100 w-8 h-8 flex-center hover:bg-accent-main-200'
											onClick={handleSend}
											disabled={streaming}
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											transition={{ duration: 0.3 }}
										>
											<IconSend />
										</motion.button>
									)}
								</div>
							</div>
						</div>
						<div className='flex items-center'>
							<div className='flex-1 leading-[0] mb-0.5 sm:mb-0'>
								<div className='inline-flex justify-center items-center text-text-100'>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										viewBox='0 0 139 34'
										className='mt-[0.5px] ml-px'
										height='0.675rem'
										fill='currentColor'
										aria-label='Claude'
									>
										<path d='M18.07 30.79c-5.02 0-8.46-2.8-10.08-7.11a19.2 19.2 0 0 1-1.22-7.04C6.77 9.41 10 4.4 17.16 4.4c4.82 0 7.78 2.1 9.48 7.1h2.06l-.28-6.9c-2.88-1.86-6.48-2.81-10.87-2.81-6.16 0-11.41 2.77-14.34 7.74A16.77 16.77 0 0 0 1 18.2c0 5.53 2.6 10.42 7.5 13.15a17.51 17.51 0 0 0 8.74 2.06c4.78 0 8.57-.91 11.93-2.5l.87-7.62h-2.1c-1.26 3.48-2.76 5.57-5.25 6.68-1.22.55-2.76.83-4.62.83Zm21.65-26.4.2-3.39H38.5l-6.33 1.9v1.02l2.8 1.3v23.79c0 1.62-.82 1.98-3 2.25V33h10.75v-1.74c-2.17-.27-3-.63-3-2.25V4.4Zm42.75 29h.83l7.27-1.38v-1.78l-1.03-.07c-1.7-.16-2.13-.52-2.13-1.9V15.58l.2-4.07h-1.15l-6.87.99v1.73l.67.12c1.85.28 2.4.8 2.4 2.1v11.3C80.9 29.13 79.2 30 77.19 30c-2.26 0-3.64-1.15-3.64-3.8V15.58l.2-4.07h-1.19l-6.87.99v1.73l.71.12c1.86.28 2.41.8 2.41 2.1v10.43c0 4.42 2.49 6.52 6.48 6.52 3.04 0 5.53-1.62 7.39-3.88l-.2 3.88Zm-20-14.06c0-5.65-3-7.82-8.4-7.82-4.79 0-8.27 1.97-8.27 5.25 0 1 .36 1.74 1.07 2.25l3.64-.47c-.16-1.1-.24-1.78-.24-2.05 0-1.86.99-2.8 3-2.8 2.97 0 4.47 2.09 4.47 5.44v1.11l-7.51 2.25c-2.49.67-3.91 1.27-4.86 2.65a5 5 0 0 0-.71 2.8c0 3.2 2.21 5.46 5.97 5.46 2.72 0 5.13-1.23 7.23-3.56.75 2.33 1.9 3.56 3.95 3.56 1.66 0 3.16-.68 4.5-1.98l-.4-1.38c-.59.16-1.14.23-1.73.23-1.15 0-1.7-.9-1.7-2.68v-8.26Zm-9.6 10.87c-2.05 0-3.31-1.19-3.31-3.28 0-1.43.67-2.26 2.1-2.73l6.08-1.94v5.85c-1.94 1.46-3.08 2.1-4.86 2.1Zm63.3 1.81v-1.78l-1.02-.07c-1.7-.16-2.14-.52-2.14-1.9V4.4l.2-3.4h-1.42l-6.32 1.9v1.02l2.8 1.3v7.83a8.84 8.84 0 0 0-5.37-1.54c-6.28 0-11.18 4.78-11.18 11.93 0 5.89 3.51 9.96 9.32 9.96 3 0 5.61-1.47 7.23-3.72l-.2 3.72h.83l7.27-1.39Zm-13.15-18.13c3 0 5.25 1.74 5.25 4.94v9a7.2 7.2 0 0 1-5.21 2.1c-4.31 0-6.48-3.4-6.48-7.94 0-5.1 2.48-8.1 6.44-8.1Zm28.52 4.5c-.55-2.64-2.17-4.15-4.42-4.15-3.36 0-5.7 2.53-5.7 6.17 0 5.37 2.85 8.85 7.44 8.85a8.6 8.6 0 0 0 7.38-4.35l1.35.36c-.6 4.66-4.82 8.14-10 8.14-6.08 0-10.27-4.5-10.27-10.9 0-6.45 4.54-11 10.63-11 4.54 0 7.74 2.73 8.77 7.48l-15.84 4.85V21.7l10.66-3.32Z'></path>
									</svg>
									<div className='tracking-tight whitespace-nowrap leading-[0] ml-1'>
										3 Sonnet
									</div>
								</div>
							</div>
							{
								<div
									className={classnames(
										'hidden sm:block text-xs text-text-500 transition-opacity duration-700 mt-1',
										{
											'opacity-0': content?.length < 4,
										}
									)}
								>
									Use &nbsp;
									<div className='inline-flex px-1 bg-200 rounded-md'>
										shift + return
									</div>
									&nbsp;for new line
								</div>
							}
						</div>
					</div>
				</fieldset>
			</div>
		</div>
	);
});

ChatInput.displayName = 'ChatInput';

const formatFileName = ({ url, name }: { url: string; name: string }) => {
	const extension = url.split('.').pop();
	switch (extension) {
		case 'jpg':
		case 'png':
		case 'gif':
			return `![image](${url})`;
		case 'mp4':
			return `<video src="${url}" controls></video>`;
		default:
			return `[${name}](${url})`;
	}
};

export default ChatInput;
