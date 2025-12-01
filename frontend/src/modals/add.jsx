import React, {
  useRef, useEffect, useContext,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import LeoProfanity from 'leo-profanity';
import ChatContext from '../contexts/chatContext';
import { selectors } from '../slices/Channels';

const validate = (channelsName) => Yup.object().shape({
  channelName: Yup.string()
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов')
    .required('От 3 до 20 символов')
    .notOneOf(channelsName, 'Должно быть уникальным'),
});

const AddModal = ({ handleClose, toast }) => {
  const inputRef = useRef();
  const chatContext = useContext(ChatContext);
  const { createChannel } = chatContext;
  const { t } = useTranslation();
  const channels = useSelector(selectors.selectAll);
  const channelsName = channels.map((channel) => channel.name);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      channelName: '',
    },
    onSubmit: async (values) => {
      try {
        await createChannel(LeoProfanity.clean(values.channelName));
        handleClose();
        toast(t('toast.channelAdd'), 'success');
      } catch {
        toast(t('toast.error'), 'error');
      }
    },
    validationSchema: validate(channelsName),
    validateOnChange: false,
  });

  return (
    <>
      <div className="fade modal-backdrop show">
        <div />
      </div>
      <div role="dialog" aria-modal="true" style={{ display: 'block' }} className="fade modal show" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title h4">{t('modal.add')}</div>
              <button onClick={handleClose} type="button" aria-label="Close" data-bs-dismiss="modal" className="btn btn-close" />
            </div>
            <div className="modal-body">
              <Form onSubmit={formik.handleSubmit} class="">
                <fieldset disabled={formik.isSubmitting}>
                  <div>
                    <Form.Control
                      className="mb-2"
                      onChange={formik.handleChange}
                      value={formik.values.channelName}
                      name="channelName"
                      id="channelName"
                      autoComplete="channelName"
                      isInvalid={formik.errors.channelName && formik.touched.channelName}
                      required
                      ref={inputRef}
                    />
                    <label className="visually-hidden" htmlFor="name">{t('chatPage.channels.name')}</label>
                    {formik.errors.channelName && formik.touched.channelName && (
                    <div className="invalid-feedback">{formik.errors.channelName}</div>
                    )}

                    <div className="d-flex justify-content-end">
                      <Button onClick={handleClose} type="button" variant="secondary me-2" disabled={formik.isSubmitting}>{t('modal.cancel')}</Button>
                      <Button type="submit" value="submit" variant="primary" disabled={formik.isSubmitting}>{t('modal.send')}</Button>
                    </div>
                  </div>
                </fieldset>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddModal;
