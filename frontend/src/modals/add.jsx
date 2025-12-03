import {
  useRef, useEffect, useContext,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Button, Form } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import LeoProfanity from 'leo-profanity'
import ChatContext from '../contexts/chatContext'
import { selectors } from '../slices/Channels'

const getSchema = channelsName => Yup.object().shape({
  channelName: Yup.string()
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов')
    .required('От 3 до 20 символов')
    .notOneOf(channelsName, 'Должно быть уникальным'),
})

const AddModal = ({ handleClose, toast }) => {
  const inputRef = useRef(null)
  const chatContext = useContext(ChatContext)
  const { createChannel } = chatContext
  const { t } = useTranslation()

  const channels = useSelector(selectors.selectAll)
  const channelsName = channels.map(ch => ch.name)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const formik = useFormik({
    initialValues: {
      channelName: '',
    },
    validationSchema: getSchema(channelsName),
    validateOnChange: false,
    onSubmit: async ({ channelName }) => {
      try {
        const cleanedName = LeoProfanity.clean(channelName)
        await createChannel(cleanedName)
        handleClose()
        toast(t('toast.channelAdd'), 'success')
      }
      catch {
        toast(t('toast.error'), 'error')
      }
    },
  })

  const hasError = formik.touched.channelName && !!formik.errors.channelName

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
              <div className="modal-title h4">{t('modal.add')}</div>
              <button
                type="button"
                aria-label="Close"
                className="btn btn-close"
                onClick={handleClose}
              />
            </div>

            <div className="modal-body">
              <Form onSubmit={formik.handleSubmit} noValidate>
                <fieldset disabled={formik.isSubmitting}>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="channelName">
                      Имя канала
                    </Form.Label>

                    <Form.Control
                      id="channelName"
                      name="channelName"
                      aria-label="Имя канала"
                      autoComplete="off"
                      className="mb-2"
                      ref={inputRef}
                      value={formik.values.channelName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={hasError}
                    />

                    <Form.Control.Feedback type="invalid">
                      {formik.errors.channelName}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <div className="d-flex justify-content-end">
                    <Button
                      type="button"
                      variant="secondary"
                      className="me-2"
                      onClick={handleClose}
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

export default AddModal
