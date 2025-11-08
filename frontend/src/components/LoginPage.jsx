const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setAuthError('')
      
      const response = await axios.post('/api/v1/login', {
        username: values.username,
        password: values.password
      })
  
      // Проверяем что ответ содержит токен
      if (response.data && response.data.token) {
        login({
          username: response.data.username,
          token: response.data.token
        })
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
  