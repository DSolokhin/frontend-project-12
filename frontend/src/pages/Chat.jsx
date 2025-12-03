import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { ToastContainer, toast } from 'react-toastify'
import { actions as channelsActions } from '../slices/Channels'
import { actions as messagesActions } from '../slices/Messages'
import routes from '../routes'
import HeaderComponent from '../components/Header'
import ChannelsComponent from '../components/Channels'
import { useAuth } from '../contexts/authProvider'
import ModalComponent from '../components/Modal'
import 'react-toastify/dist/ReactToastify.css'

const ChatPage = () => {
  const auth = useAuth()
  const dispatch = useDispatch()
  const { t } = useTranslation()

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get(routes.usersPath(), {
          headers: auth.getAuth(),
        })

        const { channels, messages, currentChannelId } = data

        dispatch(channelsActions.addChannels(channels))
        dispatch(messagesActions.addMessages(messages))
        dispatch(channelsActions.setChannelId(currentChannelId))
      } catch {
        auth.logOut()
        toast.error(t('toast.networkError'), {
          toastId: 'network-error',
        })
      }
    }

    load()
  }, [auth, dispatch, t])

  return (
    <>
      <div className="d-flex flex-column h-100">
        <HeaderComponent />

        <div className="container h-100 my-4 overflow-hidden rounded shadow">
          <div className="row h-100 bg-white flex-md-row">
            <ChannelsComponent />
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={5000} theme="light" />

      <ModalComponent />
    </>
  )
}

export default ChatPage
