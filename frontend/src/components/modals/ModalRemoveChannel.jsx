// src/components/modals/ModalRemoveChannel.jsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useApi } from '../../hooks/index.jsx';

const ModalRemoveChannel = ({ show, onHide, channel }) => {
  const api = useApi();

  const handleRemove = async () => {
    try {
      await api.removeChannel(channel.id);
      toast.success('Канал удалён');
      onHide();
    } catch (error) {
      console.error('Error removing channel:', error);
      toast.error('Ошибка при удалении канала');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="h4">Удалить канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">Уверены?</p>
        <div className="d-flex justify-content-end">
          <Button 
            type="button" 
            className="me-2 btn btn-secondary"
            onClick={onHide}
          >
            Отменить
          </Button>
          <Button 
            type="button" 
            className="btn btn-danger"
            onClick={handleRemove}
          >
            Удалить
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalRemoveChannel;
