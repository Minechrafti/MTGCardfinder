import "bootstrap/dist/css/bootstrap.min.css"
import SSRProvider from 'react-bootstrap/SSRProvider'
import Navigation from '../components/Navigation'
import "./_app.css"
import useSession from '../lib/session'

export default function App({ Component, pageProps }) {
    const session = useSession()
    const newPageProps = {
        ...pageProps,
        session
    }
    return (
        <div>
            <SSRProvider>
                <Navigation session={session} />
                <main className="page">
                    <Component {...newPageProps} />
                </main>
            </SSRProvider>
        </div>
    )
}
