// components/RegistrationPage.jsx
import React, { useState } from 'react'
import { Formik, Form, Field } from 'formik'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../store/slices/authSlice'
import { Form as BootstrapForm, Button, Alert, Card, Container, Row, Col } from 'react-bootstrap'
import axios from 'axios'

const RegistrationPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [regError, setRegError] = useState('')
  const [regSuccess, setRegSuccess] = useState('')

  const getApiBaseUrl = () => {
    if (import.meta.env.PROD) {
      return window.location.origin
    }
    return ''
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setRegError('')
      setRegSuccess('')
      
      const apiUrl = `${getApiBaseUrl()}/api/v1/signup`
      console.log('🔐 [RegistrationPage] Signup URL:', apiUrl)
      
      const response = await axios.post(apiUrl, {
        username: values.username,
        password: values.password
      })

      console.log('🔐 [RegistrationPage] Ответ сервера:', response.data)

      if (response.data && response.data.token) {
        console.log('🔐 [RegistrationPage] Регистрация успешна, токен получен')
        
        // Автоматически логиним пользователя после регистрации
        dispatch(setCredentials({
          user: { username: response.data.username },
          token: response.data.token
        }))

        setRegSuccess('Регистрация успешна! Вы автоматически вошли в систему.')
        
        setTimeout(() => {
          console.log('🔐 [RegistrationPage] Переход на главную страницу...')
          navigate('/')
        }, 2000)
        
      } else {
        setRegError('Ошибка сервера: неверный ответ')
      }
      
    } catch (error) {
      console.error('Registration error:', error)
      
      if (error.response) {
        if (error.response.status === 409) {
          setRegError('Пользователь с таким именем уже существует')
        } else if (error.response.status === 400) {
          setRegError('Некорректные данные для регистрации')
        } else {
          setRegError(`Ошибка сервера: ${error.response.status}`)
        }
      } else if (error.request) {
        setRegError('Ошибка соединения с сервером')
      } else {
        setRegError('Произошла ошибка при регистрации')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const validate = (values) => {
    const errors = {}
    
    if (!values.username) {
      errors.username = 'Обязательное поле'
    } else if (values.username.length < 3) {
      errors.username = 'От 3 до 20 символов'
    } else if (values.username.length > 20) {
      errors.username = 'От 3 до 20 символов'
    }
    
    if (!values.password) {
      errors.password = 'Обязательное поле'
    } else if (values.password.length < 6) {
      errors.password = 'Не менее 6 символов'
    }
    
    if (!values.confirmPassword) {
      errors.confirmPassword = 'Обязательное поле'
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Пароли должны совпадать'
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
                <p className="text-muted">Регистрация</p>
              </div>
              
              {regError && (
                <Alert variant="danger" className="mb-3">
                  {regError}
                </Alert>
              )}

              {regSuccess && (
                <Alert variant="success" className="mb-3">
                  {regSuccess}
                </Alert>
              )}

              <Formik
                initialValues={{ 
                  username: '', 
                  password: '', 
                  confirmPassword: '' 
                }}
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

                    <BootstrapForm.Group className="mb-3">
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

                    <BootstrapForm.Group className="mb-4">
                      <BootstrapForm.Label>Подтвердите пароль</BootstrapForm.Label>
                      <Field 
                        as={BootstrapForm.Control}
                        type="password" 
                        name="confirmPassword" 
                        placeholder="Повторите пароль"
                        isInvalid={touched.confirmPassword && errors.confirmPassword}
                      />
                      {errors.confirmPassword && touched.confirmPassword && (
                        <BootstrapForm.Control.Feedback type="invalid">
                          {errors.confirmPassword}
                        </BootstrapForm.Control.Feedback>
                      )}
                    </BootstrapForm.Group>

                    <Button 
                      variant="primary" 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-100 mb-3"
                    >
                      {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
                    </Button>

                    <div className="text-center">
                      <small className="text-muted">
                        Уже есть аккаунт? <Link to="/login">Войдите</Link>
                      </small>
                    </div>
                  </Form>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default RegistrationPage
