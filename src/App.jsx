import React from 'react'
import Layout from './components/layout/Layout.jsx'
import './styles/style.min.css'
import { CookiesProvider } from 'react-cookie';

const App = () => {
  return (
    <CookiesProvider defaultSetOptions={{ path: '/' }}>
      <Layout/>
    </CookiesProvider>
  )
}

export default App