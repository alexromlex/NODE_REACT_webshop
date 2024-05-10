import { makeAutoObservable } from 'mobx';
import { getMainSettings, getSettings } from '../api/settingsApi';

class MainStore {
    _header_img: string;
    _header_name: string;

    constructor() {
        makeAutoObservable(this);
        this._header_img = '';
        this._header_name = 'WEBSHOP';
    }

    get headerName() {
        return this._header_name;
    }

    get headerImg() {
        return this._header_img;
    }

    setHeaderImage(v: string) {
        this._header_img = v;
    }
    setHeaderName(v: string) {
        this._header_name = v;
    }

    getSettings() {
        getMainSettings().then((resp) => {
            this.setHeaderImage(resp.data.header_img);
            this.setHeaderName(resp.data.header_name);
        });
    }
}

export default new MainStore();
