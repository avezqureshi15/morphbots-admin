import { Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Layout from './layouts/Layout';
import BookingSystemConfiguration from './pages/BookingSystemConfiguration/BookingSystemConfiguration';
import ConfirmationEmailTemplate from './pages/ConfirmationEmail/ConfirmationEmailTemplate';
import CurriculumManagement from './pages/CurriculumManagement/CurriculumManagement';
import AdminTeamManagement from './pages/AdminTeamManagement/AdminTeamManagement';
import { useAppSelector } from './hooks/redux-hook';
import './index.css'
import ForgotPasswordForm from './pages/Auth/ForgotPassword';
import OtpScreen from './pages/Auth/OtpScreen';
import ChangePassword from './pages/Auth/ChangePassword';
function App() {
  const token = useAppSelector((state) => state.auth.access_token);

  // useEffect(() => {
  //   if (!token) {
  //     navigate('/login')
  //   }
  // }, [])

  return (
    <>
      <ToastContainer />
      {token ? (
        <Layout>
          <Routes>
            <Route path='/' element={token ? <Home /> : <Navigate to='/login' />} />
            <Route path='/booking-system-configuration' element={token ? <BookingSystemConfiguration /> : <Navigate to='/login' />} />
            <Route path='/confirmation-email' element={token ? <ConfirmationEmailTemplate /> : <Navigate to='/login' />} />
            <Route path='/curriculum-management' element={token ? <CurriculumManagement /> : <Navigate to='/login' />} />
            <Route path='/admin-team-management' element={token ? <AdminTeamManagement /> : <Navigate to='/login' />} />
          </Routes>
        </Layout>

      ) : (
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/forgot-password' element={<ForgotPasswordForm />} />
          <Route path='/verify-otp' element={<OtpScreen />} />
          <Route path='/reset-password' element={<ChangePassword />} />
        </Routes>
      )}
    </>
  );
}

export default App;
