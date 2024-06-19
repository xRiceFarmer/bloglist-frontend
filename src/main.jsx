import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NotificationContextProvider } from './contexts/NotificationContext'
import { UserContextProvider } from './contexts/UserContext'
const queryClient = new QueryClient()
import { BrowserRouter as Router} from 'react-router-dom'


ReactDOM.createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient}>
        <NotificationContextProvider>
            <UserContextProvider>
                <Router>
                <App />
                </Router>
            </UserContextProvider>
        </NotificationContextProvider>
    </QueryClientProvider>
)