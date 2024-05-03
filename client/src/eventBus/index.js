import { getCurrentInstance } from 'vue'
 
export default function myEventBus() {
    const internalInstance = getCurrentInstance()
    const emitter = internalInstance.appContext.config.globalProperties.emitter
    return emitter
}