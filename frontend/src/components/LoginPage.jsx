import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'

const LoginPage = () => {
  const handleSubmit = (values) => {
    console.log('Форма отправлена:', values)
    // Здесь будет логика авторизации
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
              Войти
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default LoginPage
