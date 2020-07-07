import React, { useEffect, useState } from "react";
import { useScript } from "./hooks";
import logo from "./logo.svg";
import "./App.css";

const dataKey = process.env.REACT_APP_TOKENIZATION_KEY;
const attr = {
  "data-tokenization-key": dataKey
};
function App() {
  const [scriptLoaded, scriptError] = useScript(
    "https://secure.safewebservices.com/token/Collect.js",
    attr
  );
  const [confDone, setConfDone] = useState(false);
  const [messageCCNumber, setMessageCCNumber] = useState("");
  const [messageCCExp, setMessageCCExp] = useState("");
  const [messageCVV, setMessageCVV] = useState("");

  useEffect(() => {
    // TODO: see if there is a better way of doing this... maybe react-helmet?
    if (scriptError) {
      console.error("Could not load collect.js");
      return;
    }
    if (scriptLoaded && !confDone) {
      // configure collect.js
      window.CollectJS.configure({
        variant: "inline",
        styleSniffer: "false",
        fields: {
          ccnumber: {
            selector: "#collectjs-ccnumber",
            title: "Card Number",
            placeholder: "0000 0000 0000 0000"
          },
          ccexp: {
            selector: "#collectjs-ccexp",
            title: "Card Expiration",
            placeholder: "00 / 00"
          },
          cvv: {
            display: "show",
            selector: "#collectjs-cvv",
            title: "CVV Code",
            placeholder: "***"
          }
        },
        googleFont: "Lato:400",
        customCss: {
          "border-color": "#C0C3C3",
          color: "#030D0F",
          "border-style": "solid",
          "border-width": "1px",
          "font-size": "1em",
          height: "44px",
          "line-height": "1.5",
          padding: "0 8px",
          "font-family": "Lato",
          "outline-style": "none"
        },
        validCss: {
          "border-color": "#1E7F9A",
          color: "#030D0F",
          "border-style": "solid",
          "border-width": "1px",
          "font-size": "1em",
          height: "44px",
          "line-height": "1.5",
          "outline-style": "none",
          padding: "0 8px"
        },
        invalidCss: {
          "border-color": "#E80134",
          color: "#030D0F",
          "border-style": "solid",
          "border-width": "1px",
          "font-size": "1em",
          height: "44px",
          "line-height": "1.5",
          "outline-style": "none",
          padding: "0 8px"
        },
        focusCss: {
          "border-color": "#9C007E",
          color: "#030D0F",
          "border-style": "solid",
          "border-width": "1px",
          "font-size": "1em",
          height: "44px",
          "line-height": "1.5",
          padding: "0 8px",
          "outline-style": "none",
          "box-shadow": "none"
        },
        placeholderCss: {
          "font-family": "Lato, sans-serif",
          "font-size": "0.85rem",
          color: "#C0C3C3",
          "text-indent": "4px"
        },
        callback: response => {
          console.log({ response });
        },
        validationCallback: (fieldName, valid, message) => {
          console.log({ valid });
          switch (fieldName) {
            case "ccnumber":
              return setMessageCCNumber(message);
            case "ccexp":
              return setMessageCCExp(message);
            case "cvv":
              return setMessageCVV(message);
            default:
              return false;
          }
        },
        fieldsAvailableCallback: () => {
          setConfDone(true);
        }
      });
    }
  }, [confDone, scriptError, scriptLoaded]);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <section className="mt-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col col-12 col-md-6 col-lg-4-">
              <form action="">
                <div className="form-group">
                  <label htmlFor="collectjs-ccnumber">Card Number *</label>
                  <div id="collectjs-ccnumber"></div>
                  <span>{messageCCNumber}</span>
                </div>
                <div className="form-group row">
                  <div className="col">
                    <label htmlFor="collectjs-ccexp">Expiration *</label>
                    <div id="collectjs-ccexp"></div>
                    <span>{messageCCExp}</span>
                  </div>
                  <div className="col">
                    <label htmlFor="collectjs-cvv">CVV *</label>
                    <div id="collectjs-cvv"></div>
                    <span>{messageCVV}</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
export default App;
