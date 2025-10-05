import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LoginPage from "./pages/loginPage"
import VoterPage from "./pages/voterPage"
import AdminPage from "./pages/adminPage"
import ErrorPage from "./pages/ErrorPage"

const App = () => {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/voter" element={<VoterPage />} />
        <Route path="/admin" element= {<AdminPage />} />
        <Route path="/*" element={<ErrorPage />} />
      </Routes>
    </Router>
  )
}
export default App