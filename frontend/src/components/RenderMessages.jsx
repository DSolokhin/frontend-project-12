import { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import LeoProfanity from 'leo-profanity';
import { selectors } from '../slices/Messages';
import { getCurrentChannel } from '../slices/Channels';

const RenderMessageComponent = () => {
  const currentChannel = useSelector(getCurrentChannel);
  const messageRef = useRef();
  const messages = useSelector(selectors.selectAll);

  const currentMessages = messages.filter((message) => message.channelId === currentChannel.id);

  useEffect(() => {
    messageRef.current.scrollIntoView({
      behavior: 'smooth',
    });
  }, [currentMessages]);

  return (
    <div id="messages-box" className="chat-messages overflow-auto px-5">
      { currentMessages.map((message) => (
        <div key={message.id} className="text-break mb-2">
          <b>{message.username}</b>
          :
          {` ${LeoProfanity.clean(message.body)}`}
        </div>
      ))}
      <span ref={messageRef} />
    </div>
  );
};

export default RenderMessageComponent;
