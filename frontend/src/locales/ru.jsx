export default {
  translation: {
    header: {
      exit: 'Выйти',
      title: 'Hexlet Chat',
    },
    logIn: {
      title: 'Войти',
      newUser: 'Нет аккаунта?',
      errors: {
        authorization: 'Неверные имя пользователя или пароль',
        networkError: 'Ой, что-то пошло не так',
      },
    },
    signUp: {
      title: 'Регистрация',
      registration: 'Зарегистрироваться',
      errors: {
        alreadyRegistered: 'Такой пользователь уже существует',
        networkError: 'Ой, что-то пошло не так',
      },
    },
    notFound: {
      title: 'Страница не найдена',
      feedback: 'Но вы можете перейти',
      link: 'на главную страницу',
    },
    chatPage: {
      channels: {
        name: 'Имя канала',
        title: 'Каналы',
        rename: 'Переименовать',
        remove: 'Удалить',
        control: 'Управление каналом',
      },
      chat: {
        message_one: '{{count}} сообщение',
        message_few: '{{count}} сообщения',
        message_many: '{{count}} сообщений',
        send: 'Отправить',
      },
    },
    modal: {
      add: 'Добавить',
      rename: 'Переименовать канал',
      remove: 'Удалить канал',
      confirm: 'Вы уверены?',
      send: 'Отправить',
      cancel: 'Отменить',
      removeSend: 'Удалить',
    },
    placeholder: {
      username: 'Имя пользователя',
      login: 'Ваш ник',
      password: 'Пароль',
      confirmPassword: 'Подтвердите пароль',
      inputHolder: 'Введите сообщение...',
      renderMessage: 'Новое сообщение',
    },
    toast: {
      error: 'Ошибка',
      networkError: 'Ошибка соединения',
      channelAdd: 'Канал создан',
      channelRemove: 'Канал удалён',
      channelRename: 'Канал переименован',
    },
  },
};
