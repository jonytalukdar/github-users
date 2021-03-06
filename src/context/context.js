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
  isLoading: true,
});

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);
  // requests , loading
  const [requests, setRequests] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  // errors
  const [error, setError] = useState({ show: false, msg: '' });

  // function for search github
  const searchGithubUser = async (user) => {
    // toggle error
    toggleError();
    setIsLoading(true);
    const response = await axios(`${rootUrl}/users/${user}`).catch((err) =>
      console.log(err)
    );

    if (response) {
      setGithubUser(response.data);

      const { followers_url, repos_url } = response.data;

      //fetching for repos
      axios(`${repos_url}?per_page=100`).then((response) =>
        setRepos(response.data)
      );

      //fetching for followers
      axios(`${followers_url}?per_page=100`).then((response) =>
        setFollowers(response.data)
      );
    } else {
      toggleError(true, 'There is no use with that username');
    }

    checkRequests();
    setIsLoading(false);
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
    isLoading,
  };

  return (
    <GithubContext.Provider value={contextValue}>
      {children}
    </GithubContext.Provider>
  );
};

export default GithubProvider;
