// src/components/modals/ModalRenameChannel.jsx
import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Formik, Field } from 'formik';
import { toast } from 'react-toastify';
import { useApi } from '../../hooks/index.jsx';

const ModalRenameChannel = ({ show, onHide, currentChannel }) => {
  const api = useApi();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await api.renameChannel(currentChannel.id, values.name);
      resetForm();
      onHide();
      toast.success('Канал переименован');
    } catch (error) {
      console.error('Error renaming channel:', error);
      toast.error('Ошибка при переименовании канала');
    } finally {
      setSubmitting(false);
    }
  };

  if (!currentChannel) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Переименовать канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ name: currentChannel.name }}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Имя канала</Form.Label>
                <Field
                  as={Form.Control}
                  type="text"
                  name="name"
                  placeholder="Введите новое имя канала"
                  required
                />
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button 
                  type="button" 
                  className="me-2 btn btn-secondary"
                  onClick={onHide}
                >
                  Отменить
                </Button>
                <Button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Переименование...' : 'Переименовать'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default ModalRenameChannel;
