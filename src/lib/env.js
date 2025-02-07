export const isTest = () => {
    return process.env.VITE_ENVTYPE == "test";
}
export const testlog = (v) => {
    if(isTest()) console.log(v);
}