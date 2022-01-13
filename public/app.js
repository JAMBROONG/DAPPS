const root = document.querySelector("#root");
const serverUrl = "https://5w1wgzbemm9f.bigmoralis.com:2053/server";
const appId = "7uQ481cNxNDgFLv3YqzzM76X7avmta4kivEpAi5t";
Moralis.start({
  serverUrl,
  appId
});
let token = "0x14b13e06f75e1f0fd51ca2e699589ef398e10f4c";

function Content() {
  const [balance, setBalanace] = React.useState('');
  const [firstBuy, setFirstBuy] = React.useState('');
  const [sell, setSell] = React.useState(null);
  const [buy, setBuy] = React.useState(null);
  React.useEffect(async function () {
    let user = Moralis.User.current();
    const walletAddress = user.get('ethAddress');
    const options = {
      chain: 'bsc',
      address: walletAddress,
      token_addresses: token
    };
    const balances = await Moralis.Web3API.account.getTokenBalances(options);
    setBalanace(balances[0].balance / 10 ** 9);
    const options2 = {
      chain: "bsc",
      address: walletAddress,
      order: "desc",
      from_block: "12057000"
    };
    const transactions = await Moralis.Web3API.account.getTokenTransfers(options2);
    const transactionsResults = transactions.result;
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
    return /*#__PURE__*/React.createElement("section", {
      className: "content"
    }, /*#__PURE__*/React.createElement("div", {
      className: "container-fluid"
    }, /*#__PURE__*/React.createElement("div", {
      className: "overlay-wrapper"
    }, /*#__PURE__*/React.createElement("div", {
      className: "overlay"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-3x fa-sync-alt fa-spin"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "text-bold pt-2"
    }, "Loading...")), /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-lg-12",
      style: {
        height: "200px"
      }
    })))));
  }

  return /*#__PURE__*/React.createElement("section", {
    className: "content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-lg-3 col-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "small-box bg-info"
  }, /*#__PURE__*/React.createElement("div", {
    className: "inner"
  }, /*#__PURE__*/React.createElement("b", {
    className: "txt-value"
  }, balance), /*#__PURE__*/React.createElement("h5", null, "Balance IDM")), /*#__PURE__*/React.createElement("div", {
    className: "icon"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-chart-bar"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "col-lg-3 col-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "small-box bg-success"
  }, /*#__PURE__*/React.createElement("div", {
    className: "inner"
  }, /*#__PURE__*/React.createElement("b", {
    className: "txt-value"
  }, firstBuy), /*#__PURE__*/React.createElement("h5", null, "First Buy IDM")), /*#__PURE__*/React.createElement("div", {
    className: "icon"
  }, /*#__PURE__*/React.createElement("i", {
    className: "text-bold",
    style: {
      marginTop: "-25px"
    }
  }, "#1")))), /*#__PURE__*/React.createElement("div", {
    className: "col-lg-3 col-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "small-box bg-orange"
  }, /*#__PURE__*/React.createElement("div", {
    className: "inner text-white"
  }, /*#__PURE__*/React.createElement("b", {
    className: "txt-value"
  }, buy), /*#__PURE__*/React.createElement("h5", null, "Number of Buy IDM")), /*#__PURE__*/React.createElement("div", {
    className: "icon"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-user-plus"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "col-lg-3 col-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "small-box bg-danger"
  }, /*#__PURE__*/React.createElement("div", {
    className: "inner"
  }, /*#__PURE__*/React.createElement("b", {
    className: "txt-value"
  }, sell), /*#__PURE__*/React.createElement("h5", null, "Number of Sell IDM")), /*#__PURE__*/React.createElement("div", {
    className: "icon"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-chart-pie"
  })))))));
}

function App() {
  const [login, setLogin] = React.useState(false);
  const [rendered, setRendered] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [wallet, setWallet] = React.useState("Connect Wallet");
  const [getUser, setUser] = React.useState([]);
  let user = Moralis.User.current();
  React.useEffect(async function () {
    if (!rendered) {
      setUser(user);

      if (user) {
        const walletAddress = await user.get('ethAddress');
        setWallet(walletAddress.slice(0, 6) + "..." + walletAddress.slice(walletAddress.length - 5, walletAddress.length - 1));
        setLogin(true);
      }

      setLoading(false);
      setRendered(true);
    }
  }, [rendered]);

  async function loginEvt() {
    setLoading(true);
    user = await Moralis.authenticate({
      signingMessage: "Signing in IDM Surprise Program"
    });
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

  return /*#__PURE__*/React.createElement("div", {
    className: "wrapper"
  }, /*#__PURE__*/React.createElement("nav", {
    className: "main-header navbar navbar-expand-md navbar-dark navbar-cyan elevation-2"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "navbar-brand"
  }, /*#__PURE__*/React.createElement("img", {
    src: "/img/sista.jpg",
    className: "profile-user-img img-circle elevation-2"
  }), /*#__PURE__*/React.createElement("span", {
    className: "brand-text font-weight-light ml-2"
  }, /*#__PURE__*/React.createElement("b", null, "DAPPS"), "-01")), /*#__PURE__*/React.createElement("ul", {
    className: "order-1 order-md-3 navbar-nav navbar-no-expand ml-auto text-white"
  }, /*#__PURE__*/React.createElement("li", {
    className: "nav-item"
  }, login ? /*#__PURE__*/React.createElement("button", {
    className: "btn btn-sm tombol"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-wallet"
  }), /*#__PURE__*/React.createElement("b", null, " ", wallet)) : /*#__PURE__*/React.createElement("button", {
    className: "btn btn-sm tombol",
    onClick: function () {
      loginEvt();
    }
  }, loading ? /*#__PURE__*/React.createElement("i", {
    className: "fas fa-spinner fa-spin"
  }) : /*#__PURE__*/React.createElement("b", null, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-wallet"
  }, " "), " ", wallet))), login && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-sm tombol ml-1",
    onClick: function () {
      logoutEvt();
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-sign-out-alt"
  }), " "))), login && /*#__PURE__*/React.createElement(Content, null));
}

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), root);