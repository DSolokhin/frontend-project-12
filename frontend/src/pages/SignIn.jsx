import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import axios from 'axios'
import { useAuth } from '../contexts/authProvider'
import routes from '../routes'
import HeaderComponent from '../components/Header'

const MainPage = () => {
  const auth = useAuth()
  const { t } = useTranslation()
  const [authFailed, setAuthFailed] = useState(false)
  const inputRef = useRef()
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    onSubmit: async (values) => {
      setAuthFailed(false)
      try {
        const response = await axios.post(routes.loginPath(), values)
        auth.logIn(response.data)
        navigate(routes.chat())
      } catch (err) {
        formik.setSubmitting(false)
        if (err.isAxiosError && err.response && err.response.status === 401) {
          setAuthFailed(true)
          if (inputRef.current) {
            inputRef.current.select()
          }
          return
        }
        throw err
      }
    }
  })

  return (
    <div className="d-flex flex-column h-100">
      <HeaderComponent />
      <div className="container-fluid h-100">
        <div className="row justify-content-center align-content-center h-100">
          <div className="col-12 col-md-8 col-xxl-6">
            <div className="card shadow-sm">
              <div className="card-body row p-5">
                <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                  <img
                    className="rounded-circle"
                    src="/avatar_1.jpg"
                    alt={t('logIn.title')}
                  />
                </div>
                <Form
                  onSubmit={formik.handleSubmit}
                  className="col-12 col-md-6 mt-3 mt-mb-0"
                >
                  <fieldset disabled={formik.isSubmitting}>
                    <h1 className="text-center mb-4">
                      {t('logIn.title')}
                    </h1>
                    <Form.Group className="form-floating mb-3">
                      <Form.Control
                        onChange={formik.handleChange}
                        value={formik.values.username}
                        name="username"
                        id="username"
                        autoComplete="username"
                        isInvalid={authFailed}
                        required
                        placeholder={t('placeholder.login')}
                        ref={inputRef}
                      />
                      <Form.Label htmlFor="username">
                        {t('placeholder.login')}
                      </Form.Label>
                    </Form.Group>
                    <Form.Group className="form-floating mb-4">
                      <Form.Control
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        placeholder={t('placeholder.password')}
                        type="password"
                        name="password"
                        id="password"
                        autoComplete="current-password"
                        isInvalid={authFailed}
                        required
                      />
                      <Form.Label htmlFor="password">
                        {t('placeholder.password')}
                      </Form.Label>
                      <div className="invalid-tooltip">
                        {authFailed ? t('logIn.errors.authorization') : null}
                      </div>
                    </Form.Group>
                    <Button
                      type="submit"
                      variant="outline-primary w-100 mb-3"
                    >
                      {t('logIn.title')}
                    </Button>
                  </fieldset>
                </Form>
              </div>
              <div className="card-footer p-4">
                <div className="text-center">
                  <span>{t('logIn.newUser')}</span>{' '}
                  <a href="/signup">
                    {t('signUp.title')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainPage
