import { useSelector, useDispatch } from 'react-redux'
import { Button, Dropdown, ButtonGroup } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { PlusSquare } from 'react-bootstrap-icons'
import cn from 'classnames'
import { selectors, actions, getCurrentChannel } from '../slices/Channels'
import { selectors as messagesSelect } from '../slices/Messages'
import MessagesComponent from './Messages'
import RenderMessageComponent from './RenderMessages'
import { actions as modalAction } from '../slices/Modals'

const ChannelItem = ({
  handleChannel,
  channel,
  currentChannel,
  remove,
  rename,
  t,
}) => (
  <li className="nav-item w-100">
    {
      channel.removable
        ? (
          <Dropdown as={ButtonGroup} className="d-flex">

            <Button
              type="button"
              variant={channel.id === currentChannel.id ? 'secondary' : null}
              onClick={() => handleChannel(channel.id)}
              className="w-100 rounded-0 text-start text-truncate"
            >
              <span className="me-1">#</span>
              {channel.name}
            </Button>

            <Dropdown.Toggle
              split
              variant={channel.id === currentChannel.id ? 'secondary' : null}
              id={`dropdown-${channel.id}`}
            >
              <span className="visually-hidden">
                {t('chatPage.channels.control')}
              </span>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => remove(channel.id)}>
                {t('chatPage.channels.remove')}
              </Dropdown.Item>

              <Dropdown.Item onClick={() => rename(channel.id)}>
                {t('chatPage.channels.rename')}
              </Dropdown.Item>
            </Dropdown.Menu>

          </Dropdown>
        )
        : (
          <button
            type="button"
            onClick={() => handleChannel(channel.id)}
            className={cn('w-100 rounded-0 text-start btn', {
              'btn-secondary': channel.id === currentChannel.id,
            })}
          >
            <span>#</span>
            {' '}
            {channel.name}
          </button>
        )
    }
  </li>
)

const ChannelsComponent = () => {
  const dispatch = useDispatch()
  const channels = useSelector(selectors.selectAll)
  const currentChannel = useSelector(getCurrentChannel)
  const { t } = useTranslation()

  const handleChannel = (id) => {
    dispatch(actions.setChannelId(id))
  }

  const messagesMass = useSelector(messagesSelect.selectAll)
  const currentMessages = messagesMass.filter(
    msg => msg.channelId === currentChannel.id,
  )

  const currentChannelName = channels.find(
    c => c.id === currentChannel.id,
  )?.name

  const addChannel = () => {
    dispatch(modalAction.openModal({ type: 'add' }))
  }

  const removeChannel = (id) => {
    dispatch(modalAction.openModal({ type: 'remove', id }))
  }

  const renameChannel = (id) => {
    dispatch(modalAction.openModal({ type: 'rename', id }))
  }

  return (
    <>
      <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">

        <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
          <b>{t('chatPage.channels.title')}</b>

          <button
            type="button"
            onClick={addChannel}
            className="p-0 text-primary btn btn-group-vertical"
          >
            <PlusSquare height="20" width="20" />
            <span className="visually-hidden">+</span>
          </button>
        </div>

        <ul
          id="channels-box"
          className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
        >
          {
            channels.map(channel => (
              <ChannelItem
                key={channel.id}
                handleChannel={handleChannel}
                channel={channel}
                currentChannel={currentChannel}
                remove={removeChannel}
                rename={renameChannel}
                t={t}
              />
            ))
          }
        </ul>

      </div>

      <div className="col p-0 h-100">
        <div className="d-flex flex-column h-100">

          <div className="bg-light mb-4 p-3 shadow-sm small">
            <p className="m-0">
              <b>{`# ${currentChannelName}`}</b>
            </p>

            <span className="text-muted">
              {
                t('chatPage.chat.message', {
                  count: currentMessages.length,
                })
              }
            </span>
          </div>

          <RenderMessageComponent />
          <MessagesComponent />
        </div>
      </div>
    </>
  )
}

export default ChannelsComponent
