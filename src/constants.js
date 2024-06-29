const DuegevAPIConstants = {
    user: {
        DEFAULT_PLAYERNAME: 'Player',
        DEFAULT_PREFIX: 'New',
        DEFAULT_LANGUAGE: 'en',
        DEFAULT_PROFILE_IMG: '',
        DEFAULT_PRIVILEGES: ['player']
    },

    API_MESSAGES: {
        OK: 'ok',
        FAIL: 'fail'
    },

    GENERIC_DUEGEV_SHA: 'duegevlogin',

    PRIVILEGES: {
        PLAYER: 'player',
        EDITOR: 'editor',
        TIME_MGMT: 'time_management',
        ADD_LABELS: 'add_labels',
        UPDATE_MAP: 'update_map',
        USER_MGMT: 'user_management',
        RECRUITER: 'recruiter',
        SUDO: 'sudo'
    }
}

export default DuegevAPIConstants;