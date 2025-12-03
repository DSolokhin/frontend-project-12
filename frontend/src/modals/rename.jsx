import {
  useRef, useEffect, useContext,
} from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Button, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import ChatContext from '../contexts/chatContext'
import { selectors } from '../slices/Channels'

const validate = channelsName => Yup.object().shape({
  channelname: Yup.string()
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов')
    .required('От 3 до 20 символов')
    .notOneOf(channelsName, 'Должно быть уникальным'),
})

const RenameModal = ({ handleClose, toast }) => {
  const { t } = useTranslation()
  const inputRef = useRef(null)
  const chatContext = useContext(ChatContext)
  const { renameChannel } = chatContext
  const id = useSelector(state => state.modal.id)
  const channel = useSelector(state => selectors.selectById(state, id)).name
  const channelsName = useSelector(selectors.selectAll).map(ch => ch.name)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const formik = useFormik({
    initialValues: {
      channelname: channel,
    },
    onSubmit: async (values) => {
      try {
        await renameChannel(id, values.channelname)
        handleClose()
        toast(t('toast.channelRename'), 'success')
      }
      catch {
        toast(t('toast.error'), 'error')
      }
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: validate(channelsName),
  })

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.select()
    }
  }, [])

  const hasError = formik.touched.channelname && formik.errors.channelname

  return (
    <>
      <div className="fade modal-backdrop show">
        <div />
      </div>

      <div
        role="dialog"
        aria-modal="true"
        style={{ display: 'block' }}
        className="fade modal show"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header">
              <div className="modal-title h4">
                {t('modal.rename')}
              </div>

              <button
                onClick={handleClose}
                type="button"
                aria-label="Close"
                className="btn btn-close"
              />
            </div>

            <div className="modal-body">
              <Form onSubmit={formik.handleSubmit} noValidate>
                <fieldset disabled={formik.isSubmitting}>
                  <Form.Group>

                    <Form.Label htmlFor="channelname">
                      {t('chatPage.channels.name')}
                    </Form.Label>

                    <Form.Control
                      className="mb-2"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.channelname}
                      name="channelname"
                      id="channelname"
                      aria-label="Имя канала"
                      autoComplete="off"
                      isInvalid={!!hasError}
                      ref={inputRef}
                    />

                    <Form.Control.Feedback type="invalid">
                      {formik.errors.channelname}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <div className="d-flex justify-content-end mt-3">
                    <Button
                      onClick={handleClose}
                      type="button"
                      variant="secondary"
                      className="me-2"
                      disabled={formik.isSubmitting}
                    >
                      {t('modal.cancel')}
                    </Button>

                    <Button
                      type="submit"
                      variant="primary"
                      disabled={formik.isSubmitting}
                    >
                      {t('modal.send')}
                    </Button>
                  </div>
                </fieldset>
              </Form>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default RenameModal
