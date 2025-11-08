import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout, selectCurrentUser } from '../store/slices/authSlice'
import { setChannels, setCurrentChannel, selectChannels, selectCurrentChannelId } from '../store/slices/channelsSlice'
import { setMessages, selectMessages } from '../store/slices/messagesSlice'
import { useGetChannelsQuery, useGetMessagesQuery } from '../store/api/chatApi'

const ChatPage = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)
  const channels = useSelector(selectChannels)
  const currentChannelId = useSelector(selectCurrentChannelId)
  const messages = useSelector(selectMessages)

  // Загружаем данные с помощью RTK Query
  const { 
    data: channelsData, 
    isLoading: channelsLoading,
    error: channelsError 
  } = useGetChannelsQuery()

  const { 
    data: messagesData, 
    isLoading: messagesLoading,
    error: messagesError 
  } = useGetMessagesQuery()

  // Сохраняем данные в Redux store
  useEffect(() => {
    if (channelsData) {
      dispatch(setChannels(channelsData))
      if (channelsData.length > 0 && !currentChannelId) {
        dispatch(setCurrentChannel(channelsData[0].id))
      }
    }
  }, [channelsData, dispatch, currentChannelId])

  useEffect(() => {
    if (messagesData) {
      dispatch(setMessages(messagesData))
    }
  }, [messagesData, dispatch])

  const handleLogout = () => {
    dispatch(logout())
  }

  const handleChannelSelect = (channelId) => {
    dispatch(setCurrentChannel(channelId))
  }

  // Обработка ошибок загрузки
  if (channelsError || messagesError) {
    return (
      <div className="chat-page">
        <div className="error-message">
          <h3>Ошибка загрузки данных</h3>
          <p>Проверьте подключение к серверу</p>
          <button onClick={() => window.location.reload()}>Перезагрузить</button>
        </div>
      </div>
    )
  }

  // Загрузка
  if (channelsLoading || messagesLoading) {
    return (
      <div className="chat-page">
        <div className="loading">Загрузка чата...</div>
      </div>
    )
  }

  // Получаем сообщения для текущего канала
  const currentChannelMessages = messages.filter(msg => msg.channelId === currentChannelId)
  const currentChannel = channels.find(ch => ch.id === currentChannelId)

  return (
    <div className="chat-page">
      <header className="chat-header">
        <h1>Hexlet Chat</h1>
        <div className="user-info">
          <span>Добро пожаловать, {user?.username}!</span>
          <button onClick={handleLogout} className="logout-btn">
            Выйти
          </button>
        </div>
      </header>
      
      <div className="chat-container">
        <div className="channels-sidebar">
          <h3>Каналы ({channels.length})</h3>
          <ul className="channels-list">
            {channels.map(channel => (
              <li 
                key={channel.id}
                className={`channel-item ${channel.id === currentChannelId ? 'active' : ''}`}
                onClick={() => handleChannelSelect(channel.id)}
              >
                # {channel.name}
                {channel.removable && <span className="channel-removable">⚙️</span>}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="messages-area">
          <div className="messages-header">
            <h3># {currentChannel?.name || 'Выберите канал'}</h3>
            <span>{currentChannelMessages.length} сообщений</span>
          </div>
          
          <div className="messages-list">
            {currentChannelMessages.length === 0 ? (
              <div className="no-messages">
                <p>В этом канале пока нет сообщений</p>
                <p>Будьте первым!</p>
              </div>
            ) : (
              currentChannelMessages.map(message => (
                <div key={message.id} className="message">
                  <div className="message-header">
                    <strong>{message.username}</strong>
                    <span className="message-time">только что</span>
                  </div>
                  <div className="message-body">{message.body}</div>
                </div>
              ))
            )}
          </div>

          <div className="message-input">
            <input 
              type="text" 
              placeholder="Введите сообщение..." 
              disabled
            />
            <button disabled>Отправить</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
