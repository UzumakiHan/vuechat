/* eslint-disable */
import axios from 'axios';

import qs from 'qs';

export function get(url, data) {
    return new Promise((resolve, reject) => {
        axios
            .get(url, {
                params: data
            })
            .then(res => {
                if (res) {
                    //成功回调

                    resolve(res);
                }
            })
            .catch(error => {
                reject(error);
            });
    });
}
export function post(url, data) {
    return new Promise((resolve, reject) => {
        axios
            .post(url, qs.stringify(data), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',

                    Accept: 'application/json'
                }
            })
            .then(res => {
                if (res) {
                    //成功回调

                    resolve(res);
                }
            })
            .catch(error => {
                reject(error);
            });
    });
}
