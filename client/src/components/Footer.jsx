import React from "react";
import "./css/Footer.css";
import { assets } from "../assets/frontendAssets/assets";

const Footer = () => {
    return (
        <div className="container-fluid footer">
            <h1 className="footer-head">Tomato.</h1>
            <p className="footer-para">
                Tomato: Your delicious food, delivered fresh to your door.
            </p>
                <img src={assets.play_store } className="py-3" alt="" />
            <div className=" col-md-5 col-lg-3 col-sm-12 mx-auto social-links py-4 d-flex align-items-center justify-content-around">
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
                <img src={assets.facebook_icon} alt="" />
            </div>
        </div>
    );
};

export default Footer;
