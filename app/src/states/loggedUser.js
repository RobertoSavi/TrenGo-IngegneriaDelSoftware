// https://vuejs.org/guide/scaling-up/state-management.html#simple-state-management-with-reactivity-api

import { reactive } from 'vue'

const loggedUser = reactive({
    token: undefined,
    username: undefined,
    id: undefined,
    self: undefined
})

function setLoggedUser (dati) {
    loggedUser.token = dati.token;
    loggedUser.username = dati.loggedUsername;
    loggedUser.id = dati.loggedId;
    loggedUser.self = dati.self;
}

function clearLoggedUser () {
    loggedUser.token = undefined;
    loggedUser.username = undefined;
    loggedUser.id = undefined;
    loggedUser.self = undefined;
}

export { loggedUser, setLoggedUser, clearLoggedUser } 