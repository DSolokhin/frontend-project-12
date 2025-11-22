import React, { useState } from 'react'
import { Formik, Form, Field } from 'formik'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../store/slices/authSlice'
import { Form as BootstrapForm, Button, Alert, Card, Container, Row, Col, Navbar } from 'react-bootstrap'
import axios from 'axios'

const LoginPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [authError, setAuthError] = useState('')

  const getApiBaseUrl = () => {
    if (import.meta.env.PROD) {
      return window.location.origin
    }
    return ''
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setAuthError('')
      
      const apiUrl = `${getApiBaseUrl()}/api/v1/login`
      
      const response = await axios.post(apiUrl, {
        username: values.username,
        password: values.password
      })

      if (response.data && response.data.token) {
        dispatch(setCredentials({
          user: { username: response.data.username },
          token: response.data.token
        }))

        setTimeout(() => {
          navigate('/')
        }, 100)
        
      } else {
        setAuthError('Ошибка сервера: неверный ответ')
      }
      
    } catch (error) {
      console.error('Login error:', error)
      
      if (error.response) {
        if (error.response.status === 401) {
          setAuthError('Неверное имя пользователя или пароль')
        } else {
          setAuthError(`Ошибка сервера: ${error.response.status}`)
        }
      } else if (error.request) {
        setAuthError('Ошибка соединения с сервером')
      } else {
        setAuthError('Произошла ошибка при авторизации')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const validate = (values) => {
    const errors = {}
    if (!values.username) {
      errors.username = 'Обязательное поле'
    }
    if (!values.password) {
      errors.password = 'Обязательное поле'
    }
    return errors
  }

  return (
    <div className="vh-100 bg-light">
      {/* Навбар с заголовком */}
      <Navbar bg="white" className="shadow-sm">
        <Container>
          <Navbar.Brand href="/" className="fw-bold text-primary">
            Hexlet Chat
          </Navbar.Brand>
        </Container>
      </Navbar>

      {/* Основной контент */}
      <Container className="h-100 d-flex align-items-center justify-content-center">
        <Card className="shadow-sm border-0" style={{ maxWidth: '1000px', width: '100%' }}>
          <Card.Body className="p-4">
            <Row className="align-items-center">
              {/* Большая картинка слева */}
              <Col xs={12} md={6} className="d-flex align-items-center justify-content-center mb-4 mb-md-0">
                <img 
                  src="logo192.jpg" 
                  alt="Войти" 
                  width="200" 
                  height="200"
                  className="rounded-circle"
                />
              </Col>
              
              {/* Компактная форма справа */}
              <Col xs={12} md={6}>
                <div className="mb-4">
                  <h1 className="h3 text-primary mb-2">Вход</h1>
                  <p className="text-muted mb-0">Войдите в свой аккаунт</p>
                </div>
                
                {authError && (
                  <Alert variant="danger" className="mb-3">
                    {authError}
                  </Alert>
                )}

                <Formik
                  initialValues={{ username: '', password: '' }}
                  validate={validate}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, errors, touched }) => (
                    <Form>
                      <BootstrapForm.Group className="mb-3">
                        <BootstrapForm.Label className="fw-semibold">Имя пользователя</BootstrapForm.Label>
                        <Field 
                          as={BootstrapForm.Control}
                          type="text" 
                          name="username" 
                          placeholder="Введите имя пользователя"
                          isInvalid={touched.username && errors.username}
                        />
                        {errors.username && touched.username && (
                          <BootstrapForm.Control.Feedback type="invalid">
                            {errors.username}
                          </BootstrapForm.Control.Feedback>
                        )}
                      </BootstrapForm.Group>

                      <BootstrapForm.Group className="mb-4">
                        <BootstrapForm.Label className="fw-semibold">Пароль</BootstrapForm.Label>
                        <Field 
                          as={BootstrapForm.Control}
                          type="password" 
                          name="password" 
                          placeholder="Введите пароль"
                          isInvalid={touched.password && errors.password}
                        />
                        {errors.password && touched.password && (
                          <BootstrapForm.Control.Feedback type="invalid">
                            {errors.password}
                          </BootstrapForm.Control.Feedback>
                        )}
                      </BootstrapForm.Group>

                      <Button 
                        variant="primary" 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-100 mb-3"
                      >
                        {isSubmitting ? 'Вход...' : 'Войти'}
                      </Button>

                      <div className="text-center">
                        <small className="text-muted">
                          Нет аккаунта? <Link to="/signup" className="text-decoration-none">Регистрация</Link>
                        </small>
                      </div>
                    </Form>
                  )}
                </Formik>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}

export default LoginPage
