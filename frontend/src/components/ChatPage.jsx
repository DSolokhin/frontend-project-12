// src/components/ChatPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectCurrentUser } from '../store/slices/authSlice';
import { 
  Container, Navbar, Button, Card, ListGroup, Form, InputGroup, 
  Alert, Spinner, Dropdown 
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useApi } from '../hooks/index.jsx';
import { actions as channelsActions } from '../store/slices/channelsSlice';
import { actions as messagesActions } from '../store/slices/messagesSlice';
import { customSelectors as channelsSelectors } from '../store/slices/channelsSlice';
import { customSelectors as messagesSelectors } from '../store/slices/messagesSlice';
import ModalAddChannel from './modals/ModalAddChannel';
import ModalRenameChannel from './modals/ModalRenameChannel';
import ModalRemoveChannel from './modals/ModalRemoveChannel';

const ChatPage = () => {
  const dispatch = useDispatch();
  const api = useApi();
  const user = useSelector(selectCurrentUser);
  
  // Селекторы из Redux
  const channels = useSelector(channelsSelectors.allChannels);
  const currentChannel = useSelector(channelsSelectors.currentChannel);
  const currentMessages = useSelector(messagesSelectors.currentChannelMessages);
  
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true); // Начинаем с true
  const [dataLoaded, setDataLoaded] = useState(false); // Новое состояние для данных
  const [error, setError] = useState('');
  
  // Рефы для автофокуса и скролла
  const messageInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  // Модальные окна
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);

  // Автофокус на поле ввода после загрузки данных
  useEffect(() => {
    if (dataLoaded && messageInputRef.current && currentChannel) {
      messageInputRef.current.focus();
    }
  }, [dataLoaded, currentChannel?.id]);

  // Автоскролл к новым сообщениям
  useEffect(() => {
    if (dataLoaded) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentMessages, dataLoaded]);

  // Загрузка начальных данных
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setDataLoaded(false);
      try {
        const token = localStorage.getItem('token');
        console.log('🔄 Starting data loading...');
        
        // Параллельная загрузка каналов и сообщений
        const [channelsResponse, messagesResponse] = await Promise.all([
          fetch('/api/v1/channels', {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Cache-Control': 'no-cache'
            }
          }),
          fetch('/api/v1/messages', {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Cache-Control': 'no-cache'
            }
          })
        ]);
        
        if (!channelsResponse.ok) throw new Error('Channels load failed');
        if (!messagesResponse.ok) throw new Error('Messages load failed');
        
        const channelsData = await channelsResponse.json();
        const messagesData = await messagesResponse.json();
        
        console.log('✅ Data loaded:', { 
          channels: channelsData.length, 
          messages: messagesData.length 
        });
        
        // Диспатчим данные в Redux
        dispatch(channelsActions.addChannels(channelsData));
        dispatch(messagesActions.addMessages(messagesData));
        
        // Убедимся что currentChannel установлен
        if (channelsData.length > 0 && !currentChannel) {
          const generalChannel = channelsData.find(ch => ch.name === 'general') || channelsData[0];
          if (generalChannel) {
            dispatch(channelsActions.changeChannel(generalChannel.id));
            console.log('🎯 Set current channel to:', generalChannel.name);
          }
        }
        
        setDataLoaded(true);
        
      } catch (err) {
        console.error('❌ Load error:', err);
        setError('Ошибка загрузки данных');
        toast.error('Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [dispatch]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChannel) return;
    
    try {
      const result = await api.addMessage(
        newMessage.trim(),
        currentChannel.id,
        user?.username
      );
      
      // Диспатчим новое сообщение в Redux
      if (result) {
        dispatch(messagesActions.addMessage(result));
      }
      
      setNewMessage('');
    } catch (err) {
      console.error('❌ Send error:', err);
      toast.error('Ошибка отправки сообщения');
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
  };

  // Обработчики модальных окон
  const openRenameModal = (channel) => {
    setSelectedChannel(channel);
    setShowRenameModal(true);
  };

  const openRemoveModal = (channel) => {
    setSelectedChannel(channel);
    setShowRemoveModal(true);
  };

  // Функция для переключения каналов
  const handleChannelSelect = (channelId) => {
    dispatch(channelsActions.changeChannel(channelId));
  };

  // Отладка
  console.log('📊 ChatPage state:', {
    loading,
    dataLoaded,
    channelsCount: channels.length,
    currentChannel: currentChannel?.name,
    messagesCount: currentMessages.length
  });

  // Показываем спиннер пока данные не загружены
  if (loading) {
    return (
      <div className="d-flex flex-column vh-100">
        <Navbar bg="white" expand="lg" className="shadow-sm navbar-light">
          <Container>
            <Navbar.Brand href="/" className="fw-bold text-primary">
              Hexlet Chat
            </Navbar.Brand>
          </Container>
        </Navbar>
        <div className="d-flex justify-content-center align-items-center flex-grow-1 bg-light">
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Загрузка чата...</p>
          </div>
        </div>
      </div>
    );
  }

  // Если ошибка загрузки
  if (error && !dataLoaded) {
    return (
      <div className="d-flex flex-column vh-100">
        <Navbar bg="white" expand="lg" className="shadow-sm navbar-light">
          <Container>
            <Navbar.Brand href="/" className="fw-bold text-primary">
              Hexlet Chat
            </Navbar.Brand>
          </Container>
        </Navbar>
        <div className="d-flex justify-content-center align-items-center flex-grow-1 bg-light">
          <Alert variant="danger" className="text-center">
            <h5>Ошибка загрузки</h5>
            <p>{error}</p>
            <Button variant="primary" onClick={handleRefresh}>
              Попробовать снова
            </Button>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column vh-100 bg-light">
      {/* Навбар - исправленный на белый */}
      <Navbar bg="white" expand="lg" className="shadow-sm navbar-light">
        <Container>
          <Navbar.Brand href="/" className="fw-bold text-primary">
            Hexlet Chat
          </Navbar.Brand>
          <div className="d-flex align-items-center">
            <span className="me-3 text-muted">{user?.username}</span>
            <Button 
              variant="primary" 
              onClick={handleLogout}
            >
              Выйти
            </Button>
          </div>
        </Container>
      </Navbar>

      {/* Уведомления */}
      {error && dataLoaded && (
        <Alert variant="danger" className="m-2 mb-0 rounded-0">
          <div className="d-flex justify-content-between align-items-center">
            <span>{error}</span>
            <Button size="sm" variant="outline-danger" onClick={handleRefresh}>
              Повторить
            </Button>
          </div>
        </Alert>
      )}

      {/* Основной контент - показываем только когда данные загружены */}
      {dataLoaded && (
        <Container className="h-100 my-4 overflow-hidden rounded shadow">
          <div className="row h-100 bg-white flex-md-row">
            
            {/* Боковая панель с каналами */}
            <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
              <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
                <b>Каналы</b>
                <Button 
                  type="button" 
                  className="p-0 text-primary btn btn-group-vertical border-0 bg-transparent"
                  onClick={() => setShowAddModal(true)}
                  title="Добавить канал"
                  aria-label="Добавить канал"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor" className="bi bi-plus-square">
                    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"></path>
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                  </svg>
                  <span className="visually-hidden">+</span>
                </Button>
              </div>
              
              <ul className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
                {channels.map(channel => (
                  <li key={channel.id} className="nav-item w-100 position-relative">
                    <div className="d-flex align-items-center w-100">
                      <button
                        type="button"
                        role="button"
                        data-testid={`channel-${channel.name}`}
                        className={`w-100 rounded-0 text-start btn ${
                          channel.id === currentChannel?.id ? 'btn-secondary' : ''
                        }`}
                        onClick={() => handleChannelSelect(channel.id)}
                      >
                        <span className="me-1">#</span>
                        {channel.name}
                      </button>
                      
                      {/* Кнопки редактирования и удаления для removable каналов */}
                      {channel.removable && (
                        <div className="dropdown ms-1">
                          <button
                            className="btn btn-sm border-0 p-0"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            aria-label={`Управление каналом ${channel.name}`}
                          >
                            <span className="text-muted fs-6">⋯</span>
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => openRenameModal(channel)}
                              >
                                <span className="me-2">✏️</span>
                                Переименовать
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => openRemoveModal(channel)}
                              >
                                <span className="me-2">🗑️</span>
                                Удалить
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Область чата */}
            <div className="col p-0 h-100">
              <div className="d-flex flex-column h-100">
                {/* Заголовок канала */}
                <div className="bg-light mb-4 p-3 shadow-sm small">
                  <p className="m-0">
                    <b># {currentChannel?.name || 'general'}</b>
                  </p>
                  <span className="text-muted">
                    {currentMessages.length} {getMessageCountText(currentMessages.length)}
                  </span>
                </div>

                {/* Сообщения */}
                <div className="chat-messages overflow-auto px-5 flex-grow-1">
                  {currentMessages.length > 0 ? (
                    <>
                      {currentMessages.map(message => (
                        <div key={message.id} className="mb-3">
                          <div className="d-flex align-items-start">
                            <strong className="text-primary me-2">
                              {message.username}:
                            </strong>
                            <span className="message-text">{message.body}</span>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </>
                  ) : (
                    <div className="text-center text-muted mt-5">
                      <p>В этом канале пока нет сообщений</p>
                      <small>Напишите первое сообщение!</small>
                    </div>
                  )}
                </div>

                {/* Форма отправки сообщения */}
                <div className="mt-auto px-5 py-3">
                  <Form onSubmit={handleSendMessage} noValidate className="py-1 border rounded-2">
                    <InputGroup className="has-validation">
                      <Form.Control
                        ref={messageInputRef}
                        name="body"
                        aria-label="Новое сообщение"
                        placeholder="Введите сообщение..."
                        className="border-0 p-0 ps-2 form-control"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        disabled={!currentChannel}
                      />
                      <Button 
                        type="submit" 
                        disabled={!newMessage.trim() || !currentChannel}
                        className="btn btn-group-vertical border-0"
                        aria-label="Отправить сообщение"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor" className="bi bi-arrow-right-square">
                          <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"></path>
                        </svg>
                        <span className="visually-hidden">Отправить</span>
                      </Button>
                    </InputGroup>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </Container>
      )}

      {/* Модальные окна */}
      <ModalAddChannel
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
      />
      
      <ModalRenameChannel
        show={showRenameModal}
        onHide={() => setShowRenameModal(false)}
        currentChannel={selectedChannel}
      />
      
      <ModalRemoveChannel
        show={showRemoveModal}
        onHide={() => setShowRemoveModal(false)}
        channel={selectedChannel}
      />
    </div>
  );
};

// Функция для правильного склонения слова "сообщение"
const getMessageCountText = (count) => {
  if (count % 10 === 1 && count % 100 !== 11) {
    return 'сообщение';
  } else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
    return 'сообщения';
  } else {
    return 'сообщений';
  }
};

export default ChatPage;
