import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { Provider } from 'react-redux'
import { router } from './routes'
import { store } from './store/store'
import Header from '@/widgets/header'
import '@/app/styles/app.scss'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <Header />
    <div className='wrapper'>
      <RouterProvider router={router} />
    </div>
  </Provider>,
)
