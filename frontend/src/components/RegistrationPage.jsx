import React, { useState } from 'react'
import { Formik, Form, Field } from 'formik'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../store/slices/authSlice'
import { Form as BootstrapForm, Button, Alert, Card, Container, Row, Col, Navbar } from 'react-bootstrap'
import axios from 'axios'

const RegistrationPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [regError, setRegError] = useState('')

  const getApiBaseUrl = () => {
    if (import.meta.env.PROD) {
      return window.location.origin
    }
    return ''
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setRegError('')
      
      const apiUrl = `${getApiBaseUrl()}/api/v1/signup`
      
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
                  src="logo512.jpg" 
                  alt="Регистрация" 
                  width="200" 
                  height="200"
                  className="rounded-circle"
                />
              </Col>
              
              {/* Компактная форма справа */}
              <Col xs={12} md={6}>
                <div className="mb-4">
                  <h1 className="h3 text-primary mb-2">Регистрация</h1>
                  <p className="text-muted mb-0">Создайте новый аккаунт</p>
                </div>
                
                {regError && (
                  <Alert variant="danger" className="mb-3">
                    {regError}
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

                      <BootstrapForm.Group className="mb-3">
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

                      <BootstrapForm.Group className="mb-4">
                        <BootstrapForm.Label className="fw-semibold">Подтвердите пароль</BootstrapForm.Label>
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
                          Уже есть аккаунт? <Link to="/login" className="text-decoration-none">Войдите</Link>
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

export default RegistrationPage
