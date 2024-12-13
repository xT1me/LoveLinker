
import { logout } from "../../api/auth/auth"
import { getUserById } from "../../api/users/users"

import { SET_IS_ADMIN, SET_USER } from "./actionTypes"

export class userActions {
    constructor(dispatch) {
        this.dispatch = dispatch
    }

    logoutAccount() {
        this.dispatch({
            type: SET_USER,
            payload: null
        })

        this.dispatch({
            type: SET_IS_ADMIN,
            payload: null
        })

        logout()
    }

    isAdmin(roles) {
        return roles?.includes('ROLE_ADMIN')
    }

    async setUser(userId) {
        const user = await getUserById(userId)

        this.dispatch({
            type: SET_IS_ADMIN,
            payload:this.isAdmin(user.roles)
        })

        this.dispatch({
            type: SET_USER,
            payload: user
        })
    }
}


