import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from './theme/ThemeProvider'
import { ToastProvider } from './components/ui'
import { router } from './routes/router'

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider position="bottom-right">
        <RouterProvider router={router} />
      </ToastProvider>
    </ThemeProvider>
  )
}
