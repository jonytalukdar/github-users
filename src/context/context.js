import React, { useState, useEffect, createContext } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

export const GithubContext = createContext({
  // for auto suggession
  githubUser: {},
  repos: [],
  followers: [],
  requests: 0,
  error: {},
  searchGithubUser: (user) => {},
});

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);
  // requests , loading
  const [requests, setRequests] = useState(0);
  const [loading, setLoading] = useState(false);
  // errors
  const [error, setError] = useState({ show: false, msg: '' });

  // function for search github
  const searchGithubUser = async (user) => {
    // toggle error
    toggleError();
    setLoading(true);
    const response = await axios(`${rootUrl}/users/${user}`).catch((err) =>
      console.log(err)
    );

    if (response) {
      setGithubUser(response.data);
      setLoading(false);
    } else {
      toggleError(true, 'There is no use with that username');
      setLoading(false);
    }
  };

  // check rate
  const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`)
      .then((data) => {
        let {
          rate: { remaining },
        } = data.data;

        setRequests(remaining);
        if (remaining === 0) {
          toggleError(true, 'Sorry You Have Exceeded Your Hourly Rate Limit');
        }
      })
      .catch((error) => console.log(error));
  };

  // function for error
  const toggleError = (show = false, msg = '') => {
    setError({ show, msg });
  };

  useEffect(checkRequests, []);

  const contextValue = {
    githubUser,
    repos,
    followers,
    requests,
    error,
    searchGithubUser,
  };

  return (
    <GithubContext.Provider value={contextValue}>
      {children}
    </GithubContext.Provider>
  );
};

export default GithubProvider;
