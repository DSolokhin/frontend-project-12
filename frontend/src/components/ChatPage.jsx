// components/ChatPage.jsx
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout, selectCurrentUser, selectCurrentToken } from '../store/slices/authSlice'
import { useGetChannelsQuery, useGetMessagesQuery } from '../store/api/chatApi'
import { Container, Navbar, Nav, Button, Card, ListGroup, Alert, Spinner, Form, InputGroup } from 'react-bootstrap'

const ChatPage = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)
  const token = useSelector(selectCurrentToken)
  const [currentChannelId, setCurrentChannelId] = useState(1)
  const [newMessage, setNewMessage] = useState('')

  const { 
    data: channels, 
    error: channelsError,
    isLoading: channelsLoading,
    refetch: refetchChannels 
  } = useGetChannelsQuery(undefined, {
    skip: !token
  })

  const { 
    data: messages, 
    error: messagesError,
    isLoading: messagesLoading,
    refetch: refetchMessages 
  } = useGetMessagesQuery(undefined, {
    skip: !token
  })

  const handleChannelSelect = (channelId) => {
    setCurrentChannelId(channelId)
    console.log('Выбран канал:', channelId)
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (newMessage.trim()) {
      console.log('Отправка сообщения:', newMessage, 'в канал:', currentChannelId)
      // TODO: Добавить отправку сообщения на сервер
      // Пример: 
      // dispatch(sendMessage({
      //   channelId: currentChannelId,
      //   body: newMessage
      // }))
      setNewMessage('')
    }
  }

  const handleRetry = () => {
    refetchChannels()
    refetchMessages()
  }

  // Получаем текущий канал и сообщения для него
  const currentChannel = channels?.find(channel => channel.id === currentChannelId)
  const currentChannelMessages = messages?.filter(message => 
    message.channelId === currentChannelId
  ) || []

  // Если нет токена в Redux, но есть в localStorage - покажем ошибку
  if (!token && localStorage.getItem('token')) {
    return (
      <div className="d-flex flex-column vh-100">
        <Navbar bg="primary" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand href="#">DS Chat</Navbar.Brand>
          </Container>
        </Navbar>
        <Container className="d-flex align-items-center justify-content-center flex-grow-1">
          <Alert variant="warning" className="text-center">
            <Alert.Heading>Ошибка синхронизации</Alert.Heading>
            <p>Токен есть в localStorage, но не в Redux. Обновите страницу.</p>
            <Button variant="primary" onClick={() => window.location.reload()}>
              Обновить страницу
            </Button>
          </Alert>
        </Container>
      </div>
    )
  }

  return (
    <div className="d-flex flex-column vh-100">
      {/* Навбар */}
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#">DS Chat</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text className="me-3">
              Добро пожаловать, {user?.username}!
            </Navbar.Text>
            <Button variant="outline-light" onClick={handleLogout}>
              Выйти
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Сообщения об ошибках */}
      {(channelsError?.status === 401 || messagesError?.status === 401) && (
        <Alert variant="danger" className="m-3">
          <Alert.Heading>Ошибка авторизации (401)</Alert.Heading>
          <p>Токен не передаётся в заголовках или недействителен.</p>
          <div>
            <Button variant="outline-danger" onClick={handleLogout} className="me-2">
              Войти заново
            </Button>
            <Button variant="outline-primary" onClick={handleRetry}>
              Повторить попытку
            </Button>
          </div>
        </Alert>
      )}

      {/* Основной контент */}
      <Container fluid className="flex-grow-1 d-flex p-0">
        <div className="d-flex w-100 h-100">
          
          {/* Сайдбар с каналами */}
          <div className="bg-light border-end" style={{ width: '300px' }}>
            <Card className="h-100 border-0 rounded-0">
              <Card.Header className="bg-light">
                <h5 className="mb-0 text-dark">Каналы</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <ListGroup variant="flush">
                  {channelsLoading ? (
                    <ListGroup.Item className="d-flex align-items-center">
                      <Spinner size="sm" className="me-2" />
                      Загрузка каналов...
                    </ListGroup.Item>
                  ) : channelsError ? (
                    <ListGroup.Item className="text-danger">
                      <div>Ошибка загрузки каналов</div>
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        onClick={handleRetry}
                        className="mt-2"
                      >
                        Повторить
                      </Button>
                    </ListGroup.Item>
                  ) : channels && channels.length > 0 ? (
                    channels.map(channel => (
                      <ListGroup.Item 
                        key={channel.id} 
                        action 
                        active={channel.id === currentChannelId}
                        onClick={() => handleChannelSelect(channel.id)}
                        className="channel-item"
                        style={{ 
                          cursor: 'pointer',
                          borderLeft: channel.id === currentChannelId ? '4px solid #0d6efd' : '4px solid transparent',
                          borderRadius: '0'
                        }}
                      >
                        <div className="d-flex align-items-center">
                          <span className="me-2">#</span>
                          <span className="flex-grow-1">{channel.name}</span>
                          {channel.id === currentChannelId && (
                            <span className="badge bg-primary">✓</span>
                          )}
                        </div>
                      </ListGroup.Item>
                    ))
                  ) : (
                    <ListGroup.Item className="text-muted">
                      Нет доступных каналов
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card.Body>
            </Card>
          </div>

          {/* Область сообщений */}
          <div className="flex-grow-1 d-flex flex-column">
            <Card className="h-100 border-0 rounded-0">
              <Card.Header className="bg-white border-bottom">
                <h5 className="mb-0 text-dark">
                  {currentChannel ? `# ${currentChannel.name}` : '# general'}
                </h5>
                {currentChannel && (
                  <small className="text-muted">
                    {currentChannelMessages.length} сообщений
                  </small>
                )}
              </Card.Header>
              
              <Card.Body className="d-flex flex-column p-0 h-100">
                {/* Область сообщений с прокруткой */}
                <div 
                  className="flex-grow-1 p-3" 
                  style={{ 
                    overflowY: 'auto', 
                    maxHeight: 'calc(100vh - 180px)',
                    minHeight: '200px'
                  }}
                >
                  {messagesLoading ? (
                    <div className="text-center mt-5">
                      <Spinner animation="border" variant="primary" />
                      <p className="mt-2 text-muted">Загрузка сообщений...</p>
                    </div>
                  ) : messagesError ? (
                    <div className="text-center mt-5">
                      <Alert variant="warning">
                        <p>Ошибка загрузки сообщений</p>
                        <Button variant="outline-warning" size="sm" onClick={handleRetry}>
                          Повторить попытку
                        </Button>
                      </Alert>
                    </div>
                  ) : currentChannelMessages && currentChannelMessages.length > 0 ? (
                    <div className="messages-container">
                      {currentChannelMessages.map(message => (
                        <div key={message.id} className="message-item mb-3 p-2 rounded">
                          <div className="d-flex align-items-start">
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-center mb-1">
                                <strong className="text-primary me-2">{message.username}</strong>
                                <small className="text-muted">
                                  {new Date(message.createdAt).toLocaleTimeString([], { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </small>
                              </div>
                              <div className="message-text">
                                {message.body}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center mt-5">
                      <div className="text-muted">
                        <h6>Сообщений пока нет</h6>
                        <p>Будьте первым, кто напишет в этом канале!</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Форма отправки сообщения */}
                <div className="border-top bg-light p-3">
                  <Form onSubmit={handleSendMessage}>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder={`Написать сообщение в #${currentChannel?.name || 'general'}...`}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        disabled={messagesLoading}
                        className="border-0"
                      />
                      <Button 
                        variant="primary" 
                        type="submit"
                        disabled={!newMessage.trim() || messagesLoading}
                        className="px-4"
                      >
                        Отправить
                      </Button>
                    </InputGroup>
                    <Form.Text className="text-muted">
                      Нажмите Enter для отправки
                    </Form.Text>
                  </Form>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default ChatPage
