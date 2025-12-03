import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import axios from 'axios'
import { useAuth } from '../contexts/authProvider'
import routes from '../routes'
import HeaderComponent from '../components/Header'

const SignInPage = () => {
  const auth = useAuth()
  const { t } = useTranslation()
  const [authFailed, setAuthFailed] = useState(false)
  const inputRef = useRef()
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values) => {
      setAuthFailed(false)

      try {
        const res = await axios.post(routes.loginPath(), values)
        auth.logIn(res.data)
        navigate(routes.chat())
      }
      catch {
        formik.setSubmitting(false)
        setAuthFailed(true)
        inputRef.current?.select()
      }
    },
  })

  return (
    <div className="d-flex flex-column h-100">
      <HeaderComponent />

      <div className="container-fluid h-100">
        <div className="row justify-content-center align-content-center h-100">
          <div className="col-12 col-md-8 col-xxl-6">

            <div className="card shadow-sm">
              <div className="card-body row p-5">

                <div className="col-12 col-md-6 d-flex align-items-center justify-content-center mb-4 mb-md-0">
                  <img
                    className="rounded-circle"
                    src="/avatar_1.jpg"
                    alt={t('logIn.title')}
                  />
                </div>

                <Form onSubmit={formik.handleSubmit} className="col-12 col-md-6">
                  <fieldset disabled={formik.isSubmitting}>
                    <h1 className="text-center mb-4">
                      {t('logIn.title')}
                    </h1>

                    <Form.Group className="form-floating mb-3">
                      <Form.Control
                        name="username"
                        id="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        autoComplete="username"
                        placeholder={t('placeholder.login')}
                        isInvalid={authFailed}
                        ref={inputRef}
                        required
                      />
                      <Form.Label htmlFor="username">
                        {t('placeholder.login')}
                      </Form.Label>
                    </Form.Group>

                    <Form.Group className="form-floating mb-4">
                      <Form.Control
                        type="password"
                        name="password"
                        id="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        autoComplete="current-password"
                        placeholder={t('placeholder.password')}
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

                    <Button type="submit" variant="outline-primary w-100 mb-3">
                      {t('logIn.title')}
                    </Button>
                  </fieldset>
                </Form>

              </div>

              <div className="card-footer p-4 text-center">
                <span>{t('logIn.newUser')}</span>
                {' '}
                <a href={routes.signup()}>
                  {t('signUp.title')}
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default SignInPage
