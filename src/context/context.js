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
});

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);
  // requests , loading
  const [requests, setRequests] = useState(0);
  const [loading, setLoading] = useState(false);

  // check rate
  const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`)
      .then((data) => {
        let {
          rate: { remaining },
        } = data.data;
        setRequests(remaining);
      })
      .catch((error) => console.log(error));
  };

  useEffect(checkRequests, []);

  const contextValue = {
    githubUser,
    repos,
    followers,
    requests,
  };

  return (
    <GithubContext.Provider value={contextValue}>
      {children}
    </GithubContext.Provider>
  );
};

export default GithubProvider;
