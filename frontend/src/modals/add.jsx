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
    inputRef.current?.focus()
  }, [])

  const formik = useFormik({
    initialValues: {
      channelName: '',
    },
    validationSchema: getSchema(channelsName),
    validateOnChange: false,
    onSubmit: async values => {
      try {
        const cleaned = LeoProfanity.clean(values.channelName)
        await createChannel(cleaned)
        handleClose()
        toast(t('toast.channelAdd'), 'success')
      } catch {
        toast(t('toast.error'), 'error')
      }
    },
  })

  const isInvalid = formik.touched.channelName && !!formik.errors.channelName

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
                onClick={() => handleClose()}
              />
            </div>

            <div className="modal-body">
              <Form noValidate onSubmit={formik.handleSubmit}>
                <fieldset disabled={formik.isSubmitting}>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="channelName">
                      {t('chatPage.channels.name')}
                    </Form.Label>

                    <Form.Control
                      id="channelName"
                      name="channelName"
                      aria-label={t('chatPage.channels.name')}
                      className="mb-2"
                      autoComplete="off"
                      value={formik.values.channelName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={isInvalid}
                      ref={inputRef}
                    />

                    <Form.Control.Feedback type="invalid">
                      {formik.errors.channelName}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <div className="d-flex justify-content-end">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => handleClose()}
                      className="me-2"
                    >
                      {t('modal.cancel')}
                    </Button>

                    <Button type="submit" variant="primary">
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
