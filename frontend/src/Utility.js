class Utility
{
    static ssoRedirect() {
        window.location.href = "https://auth.mattdavis.info/api/auth?redirectURL=" + encodeURIComponent(window.location.href) + "&tokenURL=" + encodeURIComponent("https://track.mattdavis.info/api/use-token");
    }
}

export default Utility;