import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectCurrentUser } from '../store/slices/authSlice';
import { 
  Container, Navbar, Button, Alert, Spinner, Form, InputGroup 
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

  const channels = useSelector(channelsSelectors.allChannels);
  const currentChannel = useSelector(channelsSelectors.currentChannel);
  const currentMessages = useSelector(messagesSelectors.currentChannelMessages);

  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const messageInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const token = localStorage.getItem('token');

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

        // Добавляем general, если нет
        if (!channelsData.find(c => c.name === 'general')) {
          channelsData.unshift({ id: 1, name: 'general' });
        }

        dispatch(channelsActions.addChannels(channelsData));
        dispatch(messagesActions.addMessages(messagesData));

        // Устанавливаем текущий канал сразу
        dispatch(channelsActions.changeChannel(channelsData[0].id));

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChannel) return;

    try {
      const result = await api.addMessage(
        newMessage.trim(),
        currentChannel.id,
        user?.username
      );

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

  const openRenameModal = (channel) => {
    setSelectedChannel(channel);
    setShowRenameModal(true);
  };

  const openRemoveModal = (channel) => {
    setSelectedChannel(channel);
    setShowRemoveModal(true);
  };

  const handleChannelSelect = (channelId) => {
    dispatch(channelsActions.changeChannel(channelId));
  };

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

  return (
    <div className="d-flex flex-column vh-100 bg-light">
      <Navbar bg="white" expand="lg" className="shadow-sm navbar-light">
        <Container>
          <Navbar.Brand href="/" className="fw-bold text-primary">
            Hexlet Chat
          </Navbar.Brand>
          <div className="d-flex align-items-center">
            <span className="me-3 text-muted">{user?.username}</span>
            <Button variant="primary" onClick={handleLogout}>Выйти</Button>
          </div>
        </Container>
      </Navbar>

      {error && (
        <Alert variant="danger" className="m-2 mb-0 rounded-0">
          <div className="d-flex justify-content-between align-items-center">
            <span>{error}</span>
            <Button size="sm" variant="outline-danger" onClick={handleRefresh}>
              Повторить
            </Button>
          </div>
        </Alert>
      )}

      <Container className="h-100 my-4 overflow-hidden rounded shadow">
        <div className="row h-100 bg-white flex-md-row">
          <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
            <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
              <b>Каналы</b>
              <Button
                type="button"
                className="p-0 text-primary btn btn-group-vertical border-0 bg-transparent"
                onClick={() => setShowAddModal(true)}
                title="Добавить канал"
              >
                +
              </Button>
            </div>

            <div className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
              {channels.map(channel => (
                <button
                  key={channel.id}
                  type="button"
                  role="button"
                  className={`w-100 rounded-0 text-start btn mb-1 ${
                    channel.id === currentChannel?.id ? 'btn-secondary' : 'btn-light'
                  }`}
                  onClick={() => handleChannelSelect(channel.id)}
                >
                  #{channel.name}
                </button>
              ))}
            </div>
          </div>

          <div className="col p-0 h-100">
            <div className="d-flex flex-column h-100">
              <div className="bg-light mb-4 p-3 shadow-sm small">
                <p className="m-0"><b>#{currentChannel?.name || 'general'}</b></p>
                <span className="text-muted">
                  {currentMessages.length} {getMessageCountText(currentMessages.length)}
                </span>
              </div>

              <div className="chat-messages overflow-auto px-5 flex-grow-1">
                {currentMessages.length > 0 ? (
                  <>
                    {currentMessages.map(message => (
                      <div key={message.id} className="mb-3">
                        <div className="d-flex align-items-start">
                          <strong className="text-primary me-2">{message.username}:</strong>
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
                    />
                    <Button 
                      type="submit" 
                      disabled={!newMessage.trim()}
                      className="btn btn-group-vertical border-0"
                    >
                      Отправить
                    </Button>
                  </InputGroup>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </Container>

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

const getMessageCountText = (count) => {
  if (count % 10 === 1 && count % 100 !== 11) return 'сообщение';
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'сообщения';
  return 'сообщений';
};

export default ChatPage;
