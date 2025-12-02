import { useState, useContext, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { InputGroup, Form, Button } from 'react-bootstrap'
import { ArrowRightSquare } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/authProvider'
import { getCurrentChannel } from '../slices/Channels'
import ChatContext from '../contexts/chatContext'

const MessagesComponent = () => {
  const { t } = useTranslation()
  const [text, setText] = useState('')
  const chatContext = useContext(ChatContext)
  const ref = useRef()
  const { sendNewMessage } = chatContext
  const currentChannel = useSelector(getCurrentChannel)
  const auth = useAuth()

  const sendMessage = async () => {
    const message = {
      body: text,
      channelId: currentChannel.id,
      username: auth.user.username,
    }
    await sendNewMessage(message)
    setText('')
  }

  useEffect(() => {
    ref.current.focus()
  }, [])

  return (
    <div className="mt-auto px-5 py-3">
      <Form
        className="py-1 border rounded-2"
        noValidate
        onSubmit={e => {
          e.preventDefault()
          sendMessage()
        }}
      >
        <InputGroup className="has-validation">
          <Form.Control
            name="body"
            placeholder="Введите сообщение..."
            value={text}
            onChange={e => setText(e.target.value)}
            aria-label="Новое сообщение"
            className="border-0 p-0 ps-2"
            noValidate
            ref={ref}
          />

          <Button
            variant="group-vertical btn-light"
            type="submit"
            disabled={text === ''}
          >
            <ArrowRightSquare width="20" height="20" />
            <span className="visually-hidden">
              {t('chatPage.chat.send')}
            </span>
          </Button>
        </InputGroup>
      </Form>
    </div>
  )
}

export default MessagesComponent
