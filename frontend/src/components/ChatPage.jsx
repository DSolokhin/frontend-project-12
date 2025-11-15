// components/ChatPage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectCurrentUser } from '../store/slices/authSlice';
import { Container, Navbar, Button, Card, ListGroup, Form, InputGroup, Alert, Spinner } from 'react-bootstrap';

const ChatPage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [currentChannelId, setCurrentChannelId] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Загрузка данных
  const loadData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found');
      }

      // Загружаем каналы
      const channelsResponse = await fetch('/api/v1/channels', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!channelsResponse.ok) {
        throw new Error(`Channels error: ${channelsResponse.status}`);
      }
      
      const channelsData = await channelsResponse.json();
      setChannels(channelsData);

      // Загружаем сообщения
      const messagesResponse = await fetch('/api/v1/messages', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!messagesResponse.ok) {
        throw new Error(`Messages error: ${messagesResponse.status}`);
      }
      
      const messagesData = await messagesResponse.json();
      
      // Сортируем по дате (от старых к новым)
      const sortedMessages = messagesData.sort((a, b) => 
        new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
      );
      
      setMessages(sortedMessages);

    } catch (err) {
      console.error('❌ Load error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/v1/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          body: newMessage.trim(),
          channelId: currentChannelId,
          username: user?.username
        })
      });

      if (!response.ok) throw new Error('Send failed');
      
      // Перезагружаем сообщения
      setLoading(true);
      await loadData();
      setNewMessage('');

    } catch (err) {
      console.error('❌ Send error:', err);
      setError('Ошибка отправки: ' + err.message);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    setError('');
    loadData();
  };

  // Фильтрация сообщений по каналу
  const currentMessages = messages.filter(msg => 
    Number(msg.channelId) === Number(currentChannelId)
  );

  // Функция для получения имени пользователя из сообщения
  const getUsername = (message) => {
    if (message.username) return message.username;
    if (message.user) return message.user;
    if (message.author) return message.author;
    if (message.userName) return message.userName;
    if (message.user_name) return message.user_name;
    return 'Неизвестный';
  };

  const currentChannel = channels.find(channel => channel.id === currentChannelId);

  if (loading) {
    return (
      <div className="d-flex flex-column vh-100">
        <Navbar bg="primary" variant="dark">
          <Container>
            <Navbar.Brand>Hexlet Chat</Navbar.Brand>
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text className="me-3">
                {user?.username}
              </Navbar.Text>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <div className="d-flex justify-content-center align-items-center flex-grow-1">
          <div className="text-center">
            <Spinner animation="border" />
            <p className="mt-2">Загрузка чата...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column vh-100">
      <Navbar bg="primary" variant="dark">
        <Container>
          <Navbar.Brand>Hexlet Chat</Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text className="me-3">
              {user?.username}
            </Navbar.Text>
            <Button 
              variant="outline-light" 
              size="sm"
              onClick={() => {
                localStorage.clear();
                dispatch(logout());
              }}
            >
              Выйти
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {error && (
        <Alert variant="danger" className="m-2">
          <div className="d-flex justify-content-between align-items-center">
            <span>{error}</span>
            <Button size="sm" variant="outline-danger" onClick={handleRefresh}>
              Повторить
            </Button>
          </div>
        </Alert>
      )}

      <Container fluid className="flex-grow-1 d-flex p-0">
        <div className="d-flex w-100 h-100">
          
          {/* Каналы */}
          <div style={{ width: '250px' }} className="bg-light border-end">
            <Card className="h-100 border-0 rounded-0">
              <Card.Header className="bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">Каналы</h6>
                  <Button 
                    size="sm" 
                    variant="outline-primary"
                    onClick={handleRefresh}
                  >
                    ↻
                  </Button>
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                <ListGroup variant="flush">
                  {channels.map(channel => (
                    <ListGroup.Item 
                      key={channel.id}
                      action 
                      active={channel.id === currentChannelId}
                      onClick={() => setCurrentChannelId(channel.id)}
                    >
                      # {channel.name}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </div>

          {/* Чат */}
          <div className="flex-grow-1 d-flex flex-column">
            <Card className="h-100 border-0 rounded-0">
              <Card.Header className="bg-white">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">
                    {currentChannel ? `# ${currentChannel.name}` : 'general'}
                  </h6>
                  <div>
                    <small className="text-muted me-2">
                      {currentMessages.length} {getMessageCountText(currentMessages.length)}
                    </small>
                  </div>
                </div>
              </Card.Header>
              
              <Card.Body className="d-flex flex-column p-0 h-100">
                {/* Сообщения */}
                <div className="flex-grow-1 p-3" style={{ overflowY: 'auto' }}>
                  {currentMessages.length > 0 ? (
                    currentMessages.map(message => (
                      <div key={message.id} className="mb-2">
                        <strong className="text-primary me-2">
                          {getUsername(message)}:
                        </strong>
                        <span>{message.body}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted mt-5">
                      <p>В этом канале пока нет сообщений</p>
                      <small>Напишите первое сообщение!</small>
                    </div>
                  )}
                </div>

                {/* Форма отправки */}
                <div className="p-3 border-top bg-light">
                  <Form onSubmit={handleSendMessage}>
                    <InputGroup>
                      <Form.Control
                        placeholder={`Написать в #${currentChannel?.name || 'general'}...`}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                      <Button type="submit" variant="primary">
                        Отправить
                      </Button>
                    </InputGroup>
                  </Form>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
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
