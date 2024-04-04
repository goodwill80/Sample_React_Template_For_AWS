import { SyntheticEvent, useState } from 'react';
import { AuthService } from '../services/AuthService';
import { Navigate } from 'react-router-dom';

type LoginComponentPropsType = {
  authService: AuthService;
  setUserNameCb: (userName: string) => void;
};

export const LoginComponent = ({
  authService,
  setUserNameCb,
}: LoginComponentPropsType) => {
  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    if (userName && password) {
      const loginResponse = await authService.login(userName, password);
      const userName2 = authService.getUserName();
      if (userName2) {
        setUserNameCb(userName2);
      }
      if (loginResponse) {
        setLoginSuccess(true);
      } else {
        setErrorMessage('invalid credentials');
      }
    } else {
      setErrorMessage('UserName and password required!');
    }
  };

  const renderLoginResult = () => {
    if (errorMessage) {
      return <label>{errorMessage}</label>;
    }
  };

  return (
    <div className="main">
      {loginSuccess && <Navigate to="/profile" replace={true} />}
      <h2>Please login</h2>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label style={{ marginRight: '4px' }}>User name</label>
        <input value={userName} onChange={(e) => setUserName(e.target.value)} />
        <br />
        <label style={{ marginRight: '10px' }}>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
        <br />
        <br />
        <input type="submit" value="Login" />
      </form>
      <br />
      {renderLoginResult()}
    </div>
  );
};
