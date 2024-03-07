'use client';

import Messages from '@/components/messages';
import ChatInput from '@/components/chatInput';
import IconClaude from '@/images/claude-ball.svg';
import { Button } from '@nextui-org/react';
import useChat from '@/hooks/useChat';
import useScroll from '@/hooks/useScroll';
import { last } from 'lodash-es';
import { useEffect, useRef } from 'react';

const Home = () => {
	const chatInputRef = useRef<HTMLTextAreaElement | null>(null);

	const {
		messages = [],
		handleChatSubmit,
		streaming,
		handleClearHistory,
		onRegenerate,
		handleStop,
	} = useChat({
		api: '/api/chat/completions',
		queryBody: {
			max_tokens: 800,
			temperature: 0.7,
			frequency_penalty: 0,
			presence_penalty: 0,
			top_p: 0.95,
			stream: true,
			model: 'gpt-4-all',
		},
		id: 'gpt-4-all',
	});
	const {
		messagesStartRef,
		messagesEndRef,
		handleScroll,
		isAtBottom,
		scrollToBottom,
	} = useScroll({
		streaming,
	});

	useEffect(() => {
		const isChatInputFocus = chatInputRef.current?.contains(
			document.activeElement
		);
		if (isChatInputFocus) {
			scrollToBottom();
		}
		if (!streaming) {
			const latestContent = last(messages)?.content;
			console.log(
				'%cLatest Message: %c%s',
				'color: #8b5cf6; font-weight: bold;',
				'color: #8b5cf6;',
				latestContent
			);
		}
	}, [messages, scrollToBottom, streaming]);

	return (
		<div
			className='claude relative z-0 flex h-full w-full overflow-x-hidden overflow-y-scroll bg-200'
			onScroll={handleScroll}
		>
			<div className='fixed z-10 pt-3 left-3 right-3 font-semibold pointer-events-none [&>*]:pointer-events-auto'>
				<div className='absolute inset-0 backdrop-blur-xl pointer-events-none'></div>
				<div className='flex justify-between items-center'>
					<Button isIconOnly className='bg-transprant'>
						<IconClaude />
					</Button>
				</div>
			</div>
			<div className='h-full w-full flex-1 flex flex-col max-w-3xl mx-auto md:px-2 relative'>
				<div ref={messagesStartRef} />
				<Messages
					streaming={streaming}
					messages={messages}
					onRegenerate={onRegenerate}
				/>
				<ChatInput
					ref={chatInputRef}
					onSend={handleChatSubmit}
					streaming={streaming}
				/>
				<div ref={messagesEndRef} />
			</div>
		</div>
	);
};

export default Home;
