const reactRouter = require('react-router-dom');

const useParams = jest.fn();
module.exports = {
  ...reactRouter,
  useParams,
};
