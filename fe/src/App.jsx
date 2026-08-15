import {
  BrowserRouter,
  Link,
  Navigate,
  NavLink,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { AuthProvider } from './auth';
import { useAuth } from './authContext';
import Logo from './components/Logo';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import SaleList from './pages/SaleList';
import SaleNew from './pages/SaleNew';
import SaleDetail from './pages/SaleDetail';
import './App.css';

function RequireAuth({ children }) {
  const { isAuthed } = useAuth();
  const location = useLocation();

  if (!isAuthed) {
    return (
      <Navigate to="/signin" replace state={{ from: location.pathname }} />
    );
  }
  return children;
}

function Header() {
  const { isAuthed, email, signOut } = useAuth();

  return (
    <header className="header">
      <Link to="/" className="brand">
        <Logo className="brand__mark" />
        <span>양파마켓</span>
      </Link>

      <nav className="nav">
        <NavLink to="/sales">상품</NavLink>
        {isAuthed && <NavLink to="/sales/new">등록</NavLink>}
      </nav>

      <div className="header__auth">
        {isAuthed ? (
          <>
            <span className="muted">{email}</span>
            <button type="button" className="btn btn--ghost" onClick={signOut}>
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to="/signin" className="btn btn--ghost">
              로그인
            </Link>
            <Link to="/signup" className="btn btn--primary">
              회원가입
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <main className="main">
          <Routes>
            <Route path="/" element={<Navigate to="/sales" replace />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />

            <Route
              path="/sales"
              element={
                <RequireAuth>
                  <SaleList />
                </RequireAuth>
              }
            />
            <Route
              path="/sales/new"
              element={
                <RequireAuth>
                  <SaleNew />
                </RequireAuth>
              }
            />
            <Route
              path="/sales/:id"
              element={
                <RequireAuth>
                  <SaleDetail />
                </RequireAuth>
              }
            />

            <Route path="*" element={<p className="muted">페이지를 찾을 수 없습니다.</p>} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}
