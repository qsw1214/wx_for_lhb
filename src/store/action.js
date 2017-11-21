import {
    getProfile,
    getConfig
} from '../service/getData'
import { setStorage, setSession, getStorage } from 'src/config/tools';

export default {

    async getUserProfile({
		commit,
        state
	}) {
        let res = await getProfile();
        commit("RECORD_USERPROFILE", res.result)
    },
    refreshConfig({
		commit,
        state
	}) {
        let config = state.config || getStorage('config');
        let version = 0
        if (config) {
            version = config.version
        }
        getConfig(version).then(res => {
          if (res.result.version <= version) {
            commit("RECORD_CONFIG", config)
          }else{
            commit("RECORD_CONFIG", res.result)
          }
        });

    },
}
