import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { actions } from '../slices/Modals'
import AddChannel from '../modals/add'
import RemoveChannel from '../modals/remove'
import RenameChannel from '../modals/rename'

const ModalComponent = () => {
  const dispatch = useDispatch()
  const handleClose = () => dispatch(actions.closeModal())
  const modal = useSelector(state => state.modal)
  const { show, type } = modal

  const toastMessage = (message, result) => {
    return result === 'success'
      ? toast.success(message, { toastId: `${message} success` })
      : toast.error(message, { toastId: `${message} error` })
  }

  const setModal = {
    add: (
      <AddChannel
        show={show}
        handleClose={handleClose}
        toast={toastMessage}
      />
    ),
    remove: (
      <RemoveChannel
        show={show}
        handleClose={handleClose}
        toast={toastMessage}
      />
    ),
    rename: (
      <RenameChannel
        show={show}
        handleClose={handleClose}
        toast={toastMessage}
      />
    ),
    closed: null,
  }

  return setModal[type]
}

export default ModalComponent
