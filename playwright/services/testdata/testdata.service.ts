import axios from "axios";
import _ from "lodash";

const testDataApiEndpoint = process.env.DATA_URL;

const queryDatabase = ({ entity, query }, callback) => {
  const fetchData = async (attrs) => {
    const { data } = await axios.get(`${testDataApiEndpoint}/${entity}`);
    return callback(data, attrs);
  };

  return Array.isArray(query) ? Promise.all(query.map(fetchData)) : fetchData(query);
};

export const filterData = (queryPayload) =>
  queryDatabase(queryPayload, (data, attrs) => _.filter(data.results, attrs));

export const findData = (queryPayload) =>
  queryDatabase(queryPayload, (data, attrs) => _.find(data.results, attrs));

export const seedDatabase = async () => {
  const { data } = await axios.post(`${testDataApiEndpoint}/seed`);
  return data;
};
