import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import axios from 'axios';
import { useAuth } from '../contexts/authProvider';
import routes from '../routes';
import HeaderComponent from '../components/Header';

const loginSchema = Yup.object().shape({
  username: Yup.string()
    .required('Обязательное поле')
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов'),
  password: Yup.string()
    .required('Обязательное поле')
    .min(6, 'Не менее 6 символов'),
  confirmpassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать'),
});

const SignUpPage = () => {
  const auth = useAuth();
  const { t } = useTranslation();
  const userNameRef = useRef();
  const passwordRef = useRef();
  const confirmRef = useRef();
  const navigate = useNavigate();
  const [regFail, setRegFail] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmpassword: '',
    },
    onSubmit: async (values) => {
      try {
        const response = await axios.post(routes.createUserPath(), values);
        auth.logIn(response.data);
        navigate(routes.chat());
      } catch (err) {
        formik.setSubmitting(false);
        if (err.isAxiosError && err.response.status === 401) {
          userNameRef.current.select();
          return;
        }
        if (err.response.status === 409) {
          setRegFail(true);
        }
        throw err;
      }
    },
    validationSchema: loginSchema,
    validateOnChange: true,
  });

  useEffect(() => {
    userNameRef.current.focus();
  }, []);

  return (
    <div className="d-flex flex-column h-100">
      <HeaderComponent />
      <div className="container-fluid h-100">
        <div className="row justify-content-center align-content-center h-100">
          <div className="col-12 col-md-8 col-xxl-6">
            <div className="card shadow-sm">
              <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
                <div>
                 <img className="rounded-circle" src="/avatar_2.jpg" alt="Регистрация" />
                </div>
                <Form onSubmit={formik.handleSubmit} className="w-50">
                  <fieldset disabled={formik.isSubmitting}>
                    <h1 className="text-center mb-4">{t('signUp.title')}</h1>
                    <Form.Group className="form-floating mb-3">
                      <Form.Control
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                        name="username"
                        id="username"
                        autoComplete="username"
                        required
                        placeholder="От 3 до 20 символов"
                        ref={userNameRef}
                        isInvalid={(formik.touched.username
                    && formik.errors.username)}
                      />
                      <Form.Control.Feedback type="invalid" tooltip>
                        {formik.errors.username}
                      </Form.Control.Feedback>
                      <Form.Label htmlFor="username">{t('placeholder.username')}</Form.Label>
                    </Form.Group>
                    <Form.Group className="form-floating mb-3">
                      <Form.Control
                        type="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        placeholder="Не менее 6 символов"
                        name="password"
                        id="password"
                        autoComplete="current-password"
                        ref={passwordRef}
                        required
                        className={formik.touched.password
                    && formik.errors.password ? 'is-invalid' : ''}
                      />
                      <Form.Label htmlFor="password">{t('placeholder.password')}</Form.Label>
                      <div className="invalid-tooltip">{formik.errors.password || regFail}</div>
                    </Form.Group>
                    <Form.Group className="form-floating mb-4">
                      <Form.Control
                        type="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.confirmpassword}
                        placeholder="Пароли должны совпадать"
                        name="confirmpassword"
                        id="confirmpassword"
                        autoComplete="new-password"
                        ref={confirmRef}
                        required
                        isInvalid={formik.errors.confirmpassword || regFail}
                        className={formik.touched.confirmpassword
                    && formik.errors.confirmpassword ? 'is-invalid' : ''}
                      />
                      <Form.Label htmlFor="confirmpassword">{t('placeholder.confirmPassword')}</Form.Label>
                      <div className="invalid-tooltip">{formik.errors.confirmpassword || t('signUp.errors.alreadyRegistered')}</div>
                    </Form.Group>
                    <Button type="submit" variant="outline-primary w-100">{t('signUp.registration')}</Button>
                  </fieldset>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
