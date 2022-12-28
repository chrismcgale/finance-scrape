const moment = require.requireActual('moment');
// Mocked version of function to allow tests with moments to pass
export default (timestamp = 0) => {
    return(moment(timestamp));
};