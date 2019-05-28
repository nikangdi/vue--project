import {get} from './helper.js'

const getSeller = get('api/seller');
const getGoods = get('api/goods');
const getRatings = get('api/ratings');

export {
    getGoods,
    getSeller,
    getRatings,
}