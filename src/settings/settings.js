export async function getSettings(env) {
    //console.log(env); //process.env.NODE_ENV
    if (env === 'production') {
        return await import('./settings.production.json');
    } else {
        return await import('./settings.local.json');
    }
}

let Settings;
(async ()=>{
    Settings = await getSettings(process.env.NODE_ENV);
})();
export {Settings};