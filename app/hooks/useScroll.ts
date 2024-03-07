import { useCallback, useRef, useState } from 'react';

interface Props {
	streaming: boolean;
}

const useScroll = ({ streaming }: Props) => {
	const messagesStartRef = useRef<HTMLDivElement>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const isAutoScrolling = useRef(false);

	const [isAtTop, setIsAtTop] = useState(true);
	const [isAtBottom, setIsAtBottom] = useState(false);
	const [isOverflowing, setIsOverflowing] = useState(false);

	const scrollToBottom = useCallback(() => {
		isAutoScrolling.current = true;

		setTimeout(() => {
			if (messagesEndRef.current) {
				messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
			}

			isAutoScrolling.current = false;
		}, 0);
	}, []);

	const handleScroll = useCallback(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(e: any) => {
			if (streaming) return;
			const bottom =
				Math.round(e.target.scrollHeight) -
					Math.round(e.target.scrollTop) ===
				Math.round(e.target.clientHeight);
			setIsAtBottom(bottom);

			const top = e.target.scrollTop === 0;
			setIsAtTop(top);
			const isOverflow = e.target.scrollHeight > e.target.clientHeight;
			setIsOverflowing(isOverflow);
		},
		[streaming]
	);

	const scrollToTop = useCallback(() => {
		if (messagesStartRef.current) {
			messagesStartRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, []);

	return {
		messagesStartRef,
		messagesEndRef,
		isAtTop,
		isAtBottom,
		isOverflowing,
		handleScroll,
		scrollToTop,
		scrollToBottom,
	};
};

export default useScroll;
