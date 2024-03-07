import { useState } from 'react';
import classnames from 'classnames';

const Actions = ({
	content,
	onRegenerate,
	isfinalCompletion = false,
}: {
	content: string;
	onRegenerate: () => void;
	isfinalCompletion?: boolean;
}) => {
	const [isCopied, setIsCopied] = useState<boolean>(false);
	const copyToClipboard = () => {
		if (!navigator.clipboard || !navigator.clipboard.writeText) {
			return;
		}

		navigator.clipboard.writeText(content).then(() => {
			setIsCopied(true);

			setTimeout(() => {
				setIsCopied(false);
			}, 2000);
		});
	};

	const handleRegenerate = () => {
		onRegenerate?.();
	};
	return (
		<div className='absolute -right-1.5 sm:right-2 bottom-0'>
			<div
				className={classnames(
					'flex items-center bg-000 border-[0.5px] border-[#706b57] shadow-sm pt-3 pb-1 px-2 rounded-lg translate-y-1/2 transition md:invisible md:group-hover:visible md:group-[.final-completion]:visible',
					{
						'!visible': isfinalCompletion,
					}
				)}
			>
				<div className='flex gap-0.5 -mx-1 -mt-2 text-text-400 justify-between items-stretch'>
					<div className='flex gap-0.5'>
						<button
							onClick={copyToClipboard}
							className='flex flex-row gap-1 items-center hover:bg-200 p-1 py-0.5 rounded-md transition-opacity delay-100 text-xs '
						>
							{isCopied ? (
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='1em'
									height='1em'
									fill='currentColor'
									viewBox='0 0 256 256'
								>
									<path d='M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z'></path>
								</svg>
							) : (
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='1em'
									height='1em'
									fill='currentColor'
									viewBox='0 0 256 256'
								>
									<path d='M200,32H163.74a47.92,47.92,0,0,0-71.48,0H56A16,16,0,0,0,40,48V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm-72,0a32,32,0,0,1,32,32H96A32,32,0,0,1,128,32Zm72,184H56V48H82.75A47.93,47.93,0,0,0,80,64v8a8,8,0,0,0,8,8h80a8,8,0,0,0,8-8V64a47.93,47.93,0,0,0-2.75-16H200Z'></path>
								</svg>
							)}
							Copy
						</button>
					</div>
					{isfinalCompletion && (
						<div className='flex gap-0.5'>
							<button
								onClick={handleRegenerate}
								className='flex flex-row gap-1 items-center hover:bg-200 p-1 py-0.5 rounded-md transition-opacity delay-100 text-xs'
							>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='12'
									height='12'
									fill='currentColor'
									viewBox='0 0 256 256'
								>
									<path d='M224,128a96,96,0,0,1-94.71,96H128A95.38,95.38,0,0,1,62.1,197.8a8,8,0,0,1,11-11.63A80,80,0,1,0,71.43,71.39a3.07,3.07,0,0,1-.26.25L44.59,96H72a8,8,0,0,1,0,16H24a8,8,0,0,1-8-8V56a8,8,0,0,1,16,0V85.8L60.25,60A96,96,0,0,1,224,128Z'></path>
								</svg>
								Retry
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Actions;
