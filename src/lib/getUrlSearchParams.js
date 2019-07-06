/**
 * Get url params value
 * @param {window.location} location object location
 * @param {string} param param name eg. ?my_param=2  param = my_param
 */
export default (location, param) => {
    const urlParams = new URLSearchParams(location.search);
    const qsArtist = urlParams.get(param);
    if (!qsArtist) return '';
    return qsArtist;
};