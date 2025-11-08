import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../store/slices/authSlice'
import axios from 'axios'

const LoginPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [authError, setAuthError] = useState('')

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setAuthError('')
      
      // Демо-режим для продакшена (Render)
      if (window.location.hostname.includes('render.com') || import.meta.env.PROD) {
        // Имитируем задержку сервера
        await new Promise(resolve => setTimeout(resolve, 500))
        
        if (values.username === 'admin' && values.password === 'admin') {
          dispatch(setCredentials({
            user: { username: 'admin' },
            token: 'demo-token-' + Date.now()
          }))
          navigate('/')
          return
        } else {
          setAuthError('Неверное имя пользователя или пароль')
          return
        }
      }

      // Оригинальный код для локальной разработки
      const response = await axios.post('/api/v1/login', {
        username: values.username,
        password: values.password
      })

      if (response.data && response.data.token) {
        dispatch(setCredentials({
          user: { username: response.data.username },
          token: response.data.token
        }))
        navigate('/')
      } else {
        setAuthError('Ошибка сервера: неверный ответ')
      }
      
    } catch (error) {
      console.error('Login error:', error)
      
      // Подробная обработка ошибок
      if (error.response) {
        // Сервер ответил с ошибкой (4xx, 5xx)
        if (error.response.status === 401) {
          setAuthError('Неверное имя пользователя или пароль')
        } else {
          setAuthError(`Ошибка сервера: ${error.response.status}`)
        }
      } else if (error.request) {
        // Запрос был сделан, но ответа нет (проблемы с сетью/API)
        setAuthError('Ошибка соединения с сервером')
      } else {
        // Что-то пошло не так
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
