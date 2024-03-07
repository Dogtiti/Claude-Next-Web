import {
	EventStreamContentType,
	fetchEventSource,
} from '@microsoft/fetch-event-source';
import { useState, useRef } from 'react';
import { dropRight } from 'lodash-es';

interface Props {
	api: string;
	queryBody: Record<string, unknown>;
	id: string;
	oldId?: string;
}

const historyNumber = 20;

const useChat = ({ api, queryBody }: Props) => {
	const ctrlRef = useRef(new AbortController());
	const [messages, setMessages] = useState<Array<Message>>([]);
	const [streaming, setStreaming] = useState(false);

	const handleClearHistory = () => {
		setMessages([]);
	};

	const onRegenerate = async () => {
		if (streaming) return;
		const history = dropRight([...(messages || [])]);
		setStreaming(true);

		const formatHistoryMessages = history.slice(-historyNumber) || [];
		setMessages(formatHistoryMessages);

		await fetchEventSourceWithRetry(
			api,
			queryBody,
			formatHistoryMessages,
			history
		);
	};

	const handleChatSubmit = async (message: {
		role: 'user';
		content: string;
	}) => {
		if (!message) {
			return;
		}

		const history = [...(messages || []), message];
		setMessages(history);
		setStreaming(true);

		const formatHistoryMessages = history.slice(-historyNumber) || [];

		await fetchEventSourceWithRetry(
			api,
			queryBody,
			formatHistoryMessages,
			history
		);
	};

	const handleStop = () => {
		ctrlRef.current?.abort();
		setStreaming(false);
		ctrlRef.current = new AbortController();
	};

	const fetchEventSourceWithRetry = async (
		api: string,
		queryBody: Record<string, unknown>,
		messages: Array<Message>,
		history: Array<Message>
	) => {
		let retryCount = 0;
		try {
			const nextIndex = history.length;
			const ctrl = ctrlRef.current;
			let buffer = '';

			class RetriableError extends Error {}
			class FatalError extends Error {}

			await fetchEventSource(api, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'text/event-stream',
				},
				body: JSON.stringify({
					...queryBody,
					stream: true,
					messages,
				}),
				signal: ctrl.signal,
				openWhenHidden: true,

				async onopen(response) {
					if (
						response.ok &&
						response.headers
							.get('content-type')
							?.includes(EventStreamContentType)
					) {
						setStreaming(true);
						return; // everything's good
					} else {
						throw new RetriableError();
					}
				},
				onclose() {
					setStreaming(false);
					// if the server closes the connection unexpectedly, retry:
					throw new RetriableError();
				},
				onerror(err) {
					console.log('on error', err, Object.keys(err));
					handleStop();
					if (err instanceof FatalError) {
						ctrl.abort();
						throw err; // rethrow to stop the operation
					} else {
						// do nothing to automatically retry. You can also
						// return a specific retry interval here.
						retryCount++;
						if (retryCount >= 3) {
							ctrl.abort();
							throw err; // stop retrying after 3 attempts
						}
					}
				},

				onmessage: (event) => {
					if (event.data === '[DONE]') {
						handleStop();
					} else if (event.data?.startsWith('[ERROR]')) {
						handleStop();
						setMessages((messages = []) => [
							...messages,
							{
								role: 'assistant',
								content: event.data.replace('[ERROR]', ''),
							},
						]);
					} else {
						const data = JSON.parse(event.data);
						const message = data?.choices[0].delta.content;
						if (message) {
							buffer += message;
						}
						const h = [...history];
						if (h?.[nextIndex]) {
							h[nextIndex].content = `${buffer}`;
						} else {
							h.push({ role: 'assistant', content: buffer });
						}
						setMessages(h);
						retryCount = 0;
					}
				},
			});
		} catch (err) {
			console.log('err', err);
			setStreaming(false);
		}
	};
	return {
		handleChatSubmit,
		messages,
		streaming,
		handleClearHistory,
		onRegenerate,
		handleStop,
	};
};

export default useChat;
