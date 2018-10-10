import React from 'react'


export class User {
    constructor() {
        this.status = 0;
        this.data = null;

        this.updateData = this.updateData.bind(this);
    }

    updateData(key, value) {
		let old = this.data;

		old[key] = value;

		this.data = old;
    }

    refresh(callback) {
        fetch("/api/User/GetUser", {
            method: "GET"
        }).then(result => {
            return result.json()
        }).then(data => {
            this.status = data.status;
        	if(data.status === 1)
            {
                this.data = data.response.user;
                callback(true);
            } else if(data.status === 100) {
                callback(false);
            } else {
            	callback(false);
            }
        }).catch(error => {
			console.log("USER: ERROR (CATCH) " + error);
            callback(false);
        });
    }
}



export const UserContext = React.createContext({});