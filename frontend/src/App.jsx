import {
  BrowserRouter, Routes, Route, Navigate
} from 'react-router-dom'
import routes from './routes'
import SignUpPage from './pages/SignUp'
import ChatPage from './pages/Chat'
import MainPage from './pages/SignIn'
import NotFoundPage from './pages/Page404'
import { ChatProvider } from './contexts/chatContext'
import AuthProvider, { useAuth } from './contexts/authProvider'
import { getCurrentChannel } from './slices/Channels'

const Access = ({ children }) => {
  const auth = useAuth()
  if (auth.user === null) {
    return <Navigate to={routes.login()} />
  }
  return children
}

const App = ({ socket }) => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route
          path={routes.chat()}
          element={(
            <ChatProvider socket={socket}>
              <Access>
                <ChatPage getMainChannel={getCurrentChannel} />
              </Access>
            </ChatProvider>
          )}
        />
        <Route path={routes.login()} element={<MainPage />} />
        <Route path={routes.notFound()} element={<NotFoundPage />} />
        <Route path={routes.signup()} element={<SignUpPage />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
)

export default App
