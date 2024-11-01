export const getFavicon = (url) => {
    const a = document.createElement("a");
    a.href = url;
    const hostname = `https://icons.duckduckgo.com/ip3/${a.hostname}.ico`;
    a.remove()
    return hostname
}