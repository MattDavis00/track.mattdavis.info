class Utility
{
    static ssoRedirect() {
        window.location.href = "https://auth.mattdavis.info/api/auth?redirectURL=" + encodeURIComponent(window.location.href) + "&tokenURL=" + encodeURIComponent("https://track.mattdavis.info/api/use-token");
    }

    static getUserMeta(callback) {
        fetch("/api/get-user-meta",{
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {'Content-Type': 'application/json'},
            redirect: 'follow',
            referrerPolicy: 'no-referrer'
        })
        .then(res => res.json())
        .then(data => callback(data));
    }
}

export default Utility;