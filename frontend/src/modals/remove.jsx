import { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { actions, selectors } from '../slices/Channels'
import ChatContext from '../contexts/chatContext'

const RemoveModal = ({ handleClose, toast }) => {
  const dispatch = useDispatch()
  const channels = useSelector(selectors.selectAll)
  const modalId = useSelector(state => state.modal.id)
  const { t } = useTranslation()
  const chatContext = useContext(ChatContext)
  const { removeChannel } = chatContext

  const close = () => handleClose(true)

  const remove = async () => {
    try {
      dispatch(actions.setChannelId(channels[0].id))
      await removeChannel(modalId)
      handleClose(true)
      toast(t('toast.channelRemove'), 'success')
    }
    catch {
      toast(t('toast.error'), 'error')
    }
  }

  return (
    <>
      <div className="fade modal-backdrop show">
        <div />
      </div>

      <div
        role="dialog"
        aria-modal="true"
        className="fade modal show"
        style={{ display: 'block' }}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header">
              <div className="modal-title h4">{t('modal.remove')}</div>
              <button
                type="button"
                aria-label="Close"
                onClick={close}
                className="btn btn-close"
              />
            </div>

            <div className="modal-body">
              <p className="lead">{t('modal.confirm')}</p>
              <div className="d-flex justify-content-end">
                <Button
                  type="button"
                  variant="secondary"
                  className="me-2"
                  onClick={close}
                >
                  {t('modal.cancel')}
                </Button>

                <Button
                  type="button"
                  variant="primary btn-danger"
                  onClick={remove}
                >
                  {t('modal.removeSend')}
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default RemoveModal
