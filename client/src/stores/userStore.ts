import { makeAutoObservable } from 'mobx';
import { ToastObjInterface, UserInterface } from '../common/types';

class UserStore {
  _isAuth: boolean;
  _toasts: ToastObjInterface[];
  _user: UserInterface | null;

  constructor() {
    makeAutoObservable(this);
    this._isAuth = false;
    this._user = null;
    this._toasts = [];
  }

  get isAuth() {
    return this._isAuth;
  }
  get toasts() {
    return this._toasts;
  }
  get user() {
    return this._user;
  }

  setAuth(v: boolean) {
    this._isAuth = v;
  }

  addToast(toast: ToastObjInterface) {
    this._toasts = [...this._toasts, toast];
  }

  removeToast(id: string) {
    if (this._toasts.length > 0) {
      this._toasts = this._toasts.filter((t) => t.id !== id);
    }
  }

  logoutUser() {
    this._isAuth = false;
    this._user = null;
  }

  setUser(user: UserInterface) {
    this._user = user;
  }
}

export default new UserStore();
