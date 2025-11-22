// src/components/modals/ModalAddChannel.jsx
import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Formik, Field } from 'formik';
import { toast } from 'react-toastify';
import { useApi } from '../../hooks/index.jsx';

const ModalAddChannel = ({ show, onHide }) => {
  const api = useApi();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await api.addChannel(values.name);
      resetForm();
      onHide();
      toast.success('Канал создан');
    } catch (error) {
      console.error('Error adding channel:', error);
      toast.error('Ошибка при создании канала');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Добавить канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ name: '' }}
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
                  placeholder="Введите имя канала"
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
                  {isSubmitting ? 'Создание...' : 'Создать'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default ModalAddChannel;
