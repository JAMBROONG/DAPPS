const root = document.querySelector("#root");
const serverUrl = "https://5w1wgzbemm9f.bigmoralis.com:2053/server";
const appId = "7uQ481cNxNDgFLv3YqzzM76X7avmta4kivEpAi5t";
Moralis.start({ serverUrl, appId });
let token = "0x14b13e06f75e1f0fd51ca2e699589ef398e10f4c";

function Content() {
    const [balance, setBalanace] = React.useState('');
    const [firstBuy, setFirstBuy] = React.useState('');
    const [sell, setSell] = React.useState(null);
    const [buy, setBuy] = React.useState(null);

    React.useEffect(async function () {
        let user = Moralis.User.current();
        const walletAddress = user.get('ethAddress');

        const options = { chain: 'bsc', address: walletAddress, token_addresses: token }
        const balances = await Moralis.Web3API.account.getTokenBalances(options);
        setBalanace(balances[0].balance / 10**9);

        const options2 = { chain: "bsc", address: walletAddress, order: "desc", from_block: "12057000" };
        const transactions = await Moralis.Web3API.account.getTokenTransfers(options2);

        const transactionsResults = transactions.result
        let lastIndex = 0;
        for (let i = 0; i < transactionsResults.length; i++) {
            const address = transactionsResults[i].address;
            lastIndex = address == token ? i : lastIndex;
        }
        const date = moment(transactionsResults[lastIndex].block_timestamp);
        setFirstBuy(`${date.format("ddd, DD MMM yyyy")}`);

        let buyCounter = 0;
        let sellCounter = 0;
        for (let i = 0; i < transactionsResults.length; i++) {

            const address = transactionsResults[i].address;
            const to_address = transactionsResults[i].to_address;
            const from_address = transactionsResults[i].from_address;

            if (to_address == walletAddress && address == token) buyCounter++;
            
            if (from_address == walletAddress && address == token) sellCounter++;
            
        }
        console.log(buyCounter);
        setBuy(buyCounter);
        setSell(sellCounter);
    }, []);

    if (!sell && !buy) {
        return (
            <section className="content">
                <div className="container-fluid">
                    <div className="overlay-wrapper">
                        <div className="overlay">
                            <i className="fas fa-3x fa-sync-alt fa-spin"></i>
                            <h3 className="text-bold pt-2">Loading...</h3>
                        </div>
                        <div className="row">
                            <div className="col-lg-12" style={{ height: "200px" }}>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
    return (
        <section className="content">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-3 col-6">
                        <div className="small-box bg-info">
                            <div className="inner">
                                <b className="txt-value">{balance}</b>
                                <h5>Balance IDM</h5>
                            </div>
                            <div className="icon">
                                <i className="fas fa-chart-bar"></i>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-6">
                        <div className="small-box bg-success">
                            <div className="inner">
                                <b className="txt-value">{firstBuy}</b>
                                <h5>First Buy IDM</h5>
                            </div>
                            <div className="icon">
                                <i className="text-bold" style={{marginTop: "-25px"}}>#1</i>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-6">
                        <div className="small-box bg-orange">
                            <div className="inner text-white">
                                <b className="txt-value">{buy}</b>
                                <h5>Number of Buy IDM</h5>
                            </div>
                            <div className="icon">
                                <i className="fas fa-user-plus"></i>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-6">
                        <div className="small-box bg-danger">
                            <div className="inner">
                                <b className="txt-value">{sell}</b>
                                <h5>Number of Sell IDM</h5>
                            </div>
                            <div className="icon">
                                <i className="fas fa-chart-pie"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}


function App() {
    const [login, setLogin] = React.useState(false);
    const [rendered, setRendered] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [wallet, setWallet] = React.useState("Connect Wallet");
    const [getUser, setUser] = React.useState([])
    let user = Moralis.User.current();

    React.useEffect(async function () {
        if (!rendered) {
            setUser(user);
            if (user) {
                const walletAddress = await user.get('ethAddress');
                setWallet(walletAddress.slice(0, 5) + "..." + walletAddress.slice(walletAddress.length - 5, walletAddress.length - 1));
                setLogin(true);
            }
            setLoading(false);
            setRendered(true);
        }
    }, [rendered]);

    async function loginEvt() {
        setLoading(true);
        user = await Moralis.authenticate({ signingMessage: "Signing in IDM Surprise Program" });
        setRendered(false);
    }

    async function logoutEvt() {
        setLoading(true);
        await Moralis.User.logOut();
        setLogin(false);
        setWallet("Connect Wallet");
        setRendered(false);
        console.log("logged out");
    }

    return (
        <div className="wrapper">
            <nav className="main-header navbar navbar-expand-md navbar-dark navbar-cyan elevation-2">
                <a href="#" className="navbar-brand">
                    <img src="/img/sista.jpg" className="profile-user-img img-circle elevation-2" />
                    <span className="brand-text font-weight-light ml-2"><b>DAPPS</b>-01</span>
                </a>
                <ul className="order-1 order-md-3 navbar-nav navbar-no-expand ml-auto text-white">
                    <li className="nav-item">
                        {login ? <button className="btn btn-sm tombol"><i className="fas fa-wallet"></i><b> {wallet}</b></button> :
                            <button className="btn btn-sm tombol" onClick={function () { loginEvt() }}>{loading ? <i className="fas fa-spinner fa-spin"></i> :
                                <b><i className="fas fa-wallet"> </i> {wallet}</b>}</button>}
                    </li>
                    {login && <button className="btn btn-sm tombol ml-1" onClick={function () {
                        logoutEvt();
                    }}><i className="fas fa-sign-out-alt"></i> </button>}
                </ul>
            </nav>
            {login && <Content />}
        </div>
    );
}

ReactDOM.render(<App />, root);