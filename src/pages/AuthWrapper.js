import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import loadingGif from '../images/preloader.gif';
import styled from 'styled-components';

function AuthWrapper({ children }) {
  const { isLoading, error } = useAuth0();

  if (isLoading) {
    return <img src={loadingGif} alt="Loading.." className="loading-img" />;
  }

  if (error) {
    return <Wrapper>{error.message}</Wrapper>;
  }

  return <Wrapper>{children}</Wrapper>;
}

const Wrapper = styled.section`
  min-height: 100vh;
  display: grid;
  place-items: center;
  img {
    width: 100%;
  }
`;

export default AuthWrapper;
