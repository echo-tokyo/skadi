import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/store'
import '@/app/styles/app.scss'
import Header from '@/widgets/header'
import { RouterProvider } from 'react-router'
import { router } from './routes/Routes'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <Header />
    <div className='wrapper'>
      <RouterProvider router={router} />
    </div>
  </Provider>,
)
