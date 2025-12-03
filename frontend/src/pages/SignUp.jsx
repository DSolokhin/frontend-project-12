import { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import axios from 'axios'
import { useAuth } from '../contexts/authProvider'
import routes from '../routes'
import HeaderComponent from '../components/Header'

const schema = Yup.object().shape({
  username: Yup.string()
    .required('Обязательное поле')
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов'),
  password: Yup.string()
    .required('Обязательное поле')
    .min(6, 'Не менее 6 символов'),
  confirmpassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Пароли должны совпадать'),
})

const SignUpPage = () => {
  const auth = useAuth()
  const { t } = useTranslation()
  const userRef = useRef()
  const [regFail, setRegFail] = useState(false)
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmpassword: '',
    },
    validationSchema: schema,
    validateOnChange: true,
    onSubmit: async values => {
      try {
        const res = await axios.post(routes.createUserPath(), values)
        auth.logIn(res.data)
        navigate(routes.chat())
      } catch (err) {
        formik.setSubmitting(false)

        if (err.isAxiosError && err.response?.status === 409) {
          setRegFail(true)
          return
        }

        if (err.response?.status === 401) {
          userRef.current?.select()
          return
        }

        throw err
      }
    },
  })

  useEffect(() => {
    userRef.current?.focus()
  }, [])

  const nameInvalid = formik.touched.username && formik.errors.username
  const passInvalid = formik.touched.password && formik.errors.password
  const confInvalid =
    formik.touched.confirmpassword && formik.errors.confirmpassword

  return (
    <div className="d-flex flex-column h-100">
      <HeaderComponent />

      <div className="container-fluid h-100">
        <div className="row justify-content-center align-content-center h-100">

          <div className="col-12 col-md-8 col-xxl-6">
            <div className="card shadow-sm">

              <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">

                <div className="mb-4 mb-md-0">
                  <img className="rounded-circle" src="/avatar_2.jpg" alt="Sign up" />
                </div>

                <Form onSubmit={formik.handleSubmit} className="w-50">
                  <fieldset disabled={formik.isSubmitting}>
                    <h1 className="text-center mb-4">
                      {t('signUp.title')}
                    </h1>

                    <Form.Group className="form-floating mb-3">
                      <Form.Control
                        ref={userRef}
                        name="username"
                        id="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="username"
                        autoComplete="username"
                        isInvalid={nameInvalid || regFail}
                      />
                      <Form.Label htmlFor="username">
                        {t('placeholder.username')}
                      </Form.Label>

                      <Form.Control.Feedback type="invalid" tooltip>
                        {formik.errors.username}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="form-floating mb-3">
                      <Form.Control
                        type="password"
                        name="password"
                        id="password"
                        placeholder="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        autoComplete="new-password"
                        isInvalid={passInvalid || regFail}
                      />
                      <Form.Label htmlFor="password">
                        {t('placeholder.password')}
                      </Form.Label>

                      <div className="invalid-tooltip">
                        {formik.errors.password}
                      </div>
                    </Form.Group>

                    <Form.Group className="form-floating mb-4">
                      <Form.Control
                        type="password"
                        name="confirmpassword"
                        id="confirmpassword"
                        placeholder="confirm"
                        value={formik.values.confirmpassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        autoComplete="new-password"
                        isInvalid={confInvalid || regFail}
                      />
                      <Form.Label htmlFor="confirmpassword">
                        {t('placeholder.confirmPassword')}
                      </Form.Label>

                      <div className="invalid-tooltip">
                        {formik.errors.confirmpassword
                          || (regFail && t('signUp.errors.alreadyRegistered'))}
                      </div>
                    </Form.Group>

                    <Button type="submit" variant="outline-primary w-100">
                      {t('signUp.registration')}
                    </Button>
                  </fieldset>
                </Form>

              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default SignUpPage
