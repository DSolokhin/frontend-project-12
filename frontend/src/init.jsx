import { io } from 'socket.io-client'
import { Provider } from 'react-redux'
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import filter from 'leo-profanity'
import store from './slices/StoreReducer'
import App from './App'
import ru from './locales/ru'

const rollbarConfig = {
  accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
  environment: 'production'
}

const init = async () => {
  filter.add(filter.getDictionary('ru'))

  const i18n = i18next.createInstance()
  await i18n.use(initReactI18next).init({
    resources: { ru },
    fallbackLng: 'ru'
  })

  const socket = io()

  return (
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <Provider store={store}>
          <App socket={socket} />
        </Provider>
      </ErrorBoundary>
    </RollbarProvider>
  )
}

export default init
