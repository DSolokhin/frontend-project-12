import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [authError, setAuthError] = useState('')

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setAuthError('')
      
      const response = await axios.post('/api/v1/login', {
        username: values.username,
        password: values.password
      })

      login({
        username: response.data.username,
        token: response.data.token
      })

      navigate('/')
      
    } catch (error) {
      console.error('Login error:', error)
      setAuthError('Неверное имя пользователя или пароль')
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
    <div className="login-page">
      <h1>Авторизация</h1>
      
      {authError && (
        <div className="auth-error">
          {authError}
        </div>
      )}

      <Formik
        initialValues={{ username: '', password: '' }}
        validate={validate}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="login-form">
            <div className="form-group">
              <label htmlFor="username">Имя пользователя:</label>
              <Field 
                type="text" 
                id="username"
                name="username" 
                placeholder="Введите имя пользователя"
              />
              <ErrorMessage name="username" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="password">Пароль:</label>
              <Field 
                type="password" 
                id="password"
                name="password" 
                placeholder="Введите пароль"
              />
              <ErrorMessage name="password" component="div" className="error" />
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Вход...' : 'Войти'}
            </button>
          </Form>
        )}
      </Formik>

      <div className="test-credentials">
        <p><strong>Тестовые данные:</strong></p>
        <p>Имя пользователя: <code>admin</code></p>
        <p>Пароль: <code>admin</code></p>
      </div>
    </div>
  )
}

export default LoginPage
