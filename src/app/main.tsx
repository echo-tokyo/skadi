import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { Provider } from 'react-redux'
import { router } from './routes'
import { store } from './store/store'
import '@/app/styles/app.scss'
import Header from '@/widgets/header'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <Header />
    <div className='wrapper'>
      <RouterProvider router={router} />
    </div>
  </Provider>,
)
