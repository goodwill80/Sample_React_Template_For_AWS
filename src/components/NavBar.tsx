import { NavLink } from 'react-router-dom';

type NavBarPropsType = { username: string | undefined };

function NavBar({ username }: NavBarPropsType) {
  const renderLoginLogout = () => {
    if (username) {
      return (
        <NavLink to="/logout" style={{ float: 'right' }}>
          {username}
        </NavLink>
      );
    } else {
      return (
        <NavLink to="/login" style={{ float: 'right' }}>
          Login
        </NavLink>
      );
    }
  };
  return (
    <div className="navbar">
      <NavLink to={'/'}>Home</NavLink>
      <NavLink to={'/profile'}>Profile</NavLink>
      <NavLink to={'/spaces'}>Spaces</NavLink>
      <NavLink to={'/createSpace'}>Create space</NavLink>
      {renderLoginLogout()}
    </div>
  );
}

export default NavBar;
