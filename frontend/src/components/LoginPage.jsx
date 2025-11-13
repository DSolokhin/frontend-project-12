// components/LoginPage.jsx
import React, { useState } from 'react'
import { Formik, Form, Field } from 'formik'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../store/slices/authSlice'
import { Form as BootstrapForm, Button, Alert, Card, Container, Row, Col } from 'react-bootstrap'
import axios from 'axios'

const LoginPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [authError, setAuthError] = useState('')

  // Функция для определения правильного API URL
  const getApiBaseUrl = () => {
    // В production используем абсолютный URL, в development - относительный
    if (import.meta.env.PROD) {
      return window.location.origin + '/api/v1'
    }
    return '/api/v1'
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setAuthError('')
      
      const apiUrl = `${getApiBaseUrl()}/login`
      console.log('🔐 [LoginPage] Login URL:', apiUrl)
      
      const response = await axios.post(apiUrl, {
        username: values.username,
        password: values.password
      })

      console.log('🔐 [LoginPage] Ответ сервера:', response.data)

      if (response.data && response.data.token) {
        console.log('🔐 [LoginPage] Токен получен, диспатч credentials...')
        
        dispatch(setCredentials({
          user: { username: response.data.username },
          token: response.data.token
        }))

        // Даём время Redux обновиться перед навигацией
        setTimeout(() => {
          console.log('🔐 [LoginPage] localStorage token:', localStorage.getItem('token'))
          console.log('🔐 [LoginPage] Переход на главную страницу...')
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
    <Container fluid className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h1 className="h3">DS Chat</h1>
                <p className="text-muted">Войдите в свой аккаунт</p>
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
                      <BootstrapForm.Label>Имя пользователя</BootstrapForm.Label>
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
                      <BootstrapForm.Label>Пароль</BootstrapForm.Label>
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
                      className="w-100"
                    >
                      {isSubmitting ? 'Вход...' : 'Войти'}
                    </Button>
                  </Form>
                )}
              </Formik>

              <Card className="mt-4">
                <Card.Body className="p-3">
                  <Card.Text className="text-center mb-2">
                    <strong>Тестовые данные:</strong>
                  </Card.Text>
                  <div className="text-center">
                    <small className="text-muted">
                      Имя пользователя: <code>admin</code>
                    </small>
                    <br />
                    <small className="text-muted">
                      Пароль: <code>admin</code>
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default LoginPage
