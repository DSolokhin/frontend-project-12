import { Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/authProvider'
import routes from '../routes'

const HeaderComponent = () => {
  const { t } = useTranslation()
  const auth = useAuth()
  const loggedIn = auth.user !== null

  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <a className="navbar-brand" href={routes.chat()}>
          {t('header.title')}
        </a>

        {loggedIn
          ? (
            <Button onClick={auth.logOut}>
              {t('header.exit')}
            </Button>
            )
          : null}
      </div>
    </nav>
  )
}

export default HeaderComponent
