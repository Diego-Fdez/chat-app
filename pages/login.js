import Head from 'next/head';
import styled from '@emotion/styled';
import { Button } from '@mui/material';
import swal from 'sweetalert';
import { useState, useEffect } from 'react';
import firebase from '../config/firebase';
import Loader from '../components/Loading';

const Login = () => {
  const [loading, setLoading] = useState(false);

  /**
   * When the user clicks the Google Sign In button, the user will be redirected to the Google Sign In
   * page, and if the user successfully signs in, the user will be redirected back to the app.
   */
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await firebase.googleSignIn();
      setLoading(false);
    } catch (error) {
      swal('ERROR!', `${error}`, 'error');
      setLoading(false);
    }
  };

  useEffect(() => {}, []);

  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>
      {loading ? (
        <Loader />
      ) : (
        <LogInContainer>
          <Logo src='/chat.png' />
          <Button type='button' onClick={handleGoogleSignIn} variant='outlined'>
            Sign in with Google
          </Button>
        </LogInContainer>
      )}
    </Container>
  );
};

export default Login;

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
`;

const LogInContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 100px;
  align-items: center;
  background: rgba(5, 12, 20, 0.25);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

const Logo = styled.img`
  height: 200px;
  width: 200px;
  margin-bottom: 50px;
`;
