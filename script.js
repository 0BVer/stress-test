import http from 'k6/http';
import {sleep} from 'k6';

export default function () {
    let i = Math.floor(Math.random() * 5) + 500;
    let j = Math.floor(Math.random() * 5) + 500;

    http.get(`http://localhost/api/v1/multi?x=${i}&y=${j}`);
    sleep(1); // sleep while a second
}
