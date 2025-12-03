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

const getSchema = channelsName => Yup.object().shape({
  channelname: Yup.string()
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов')
    .required('От 3 до 20 символов')
    .notOneOf(channelsName, 'Должно быть уникальным'),
})

const RenameModal = ({ handleClose, toast }) => {
  const { t } = useTranslation()
  const inputRef = useRef()
  const chatContext = useContext(ChatContext)
  const { renameChannel } = chatContext

  const id = useSelector(state => state.modal.id)
  const channel = useSelector(state => selectors.selectById(state, id))
  const channelsName = useSelector(selectors.selectAll).map(ch => ch.name)

  useEffect(() => {
    inputRef.current.focus()
    inputRef.current.select()
  }, [])

  const formik = useFormik({
    initialValues: {
      channelname: channel.name,
    },
    validationSchema: getSchema(channelsName),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async values => {
      try {
        await renameChannel(id, values.channelname)
        handleClose()
        toast(t('toast.channelRename'), 'success')
      } catch {
        toast(t('toast.error'), 'error')
      }
    },
  })

  const invalid = formik.errors.channelname && formik.touched.channelname

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
              <div className="modal-title h4">{t('modal.rename')}</div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => handleClose()}
                className="btn btn-close"
              />
            </div>

            <div className="modal-body">
              <Form noValidate onSubmit={formik.handleSubmit}>
                <fieldset disabled={formik.isSubmitting}>
                  <Form.Control
                    className="mb-2"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.channelname}
                    name="channelname"
                    id="channelname"
                    autoComplete="off"
                    isInvalid={invalid}
                    ref={inputRef}
                    required
                  />

                  {invalid && (
                    <div className="invalid-feedback">{formik.errors.channelname}</div>
                  )}

                  <div className="d-flex justify-content-end">
                    <Button
                      type="button"
                      variant="secondary"
                      className="me-2"
                      onClick={() => handleClose()}
                    >
                      {t('modal.cancel')}
                    </Button>

                    <Button
                      type="submit"
                      variant="primary"
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
