import React from 'react';

const Footer = () => {
  return (
    <section className="footer-section">
      <div className="w-layout-blockcontainer footer-container w-container">
        <div className="footer-grid">
          <div className="footer-grid-div-1">
            <img
              src="/images/Screenshot---logo-2025-12-23-at-11.39.16-pm.png"
              loading="lazy"
              sizes="(max-width: 767px) 100vw, (max-width: 991px) 727.9921875px, 939.9921875px"
              srcSet="/images/Screenshot---logo-2025-12-23-at-11.39.16-pm-p-500.png 500w, /images/Screenshot---logo-2025-12-23-at-11.39.16-pm-p-800.png 800w, /images/Screenshot---logo-2025-12-23-at-11.39.16-pm-p-1080.png 1080w, /images/Screenshot---logo-2025-12-23-at-11.39.16-pm-p-1600.png 1600w, /images/Screenshot---logo-2025-12-23-at-11.39.16-pm.png 1782w"
              alt="MaboCore Logo"
              className="footer-logo"
            />
            <div className="text light-grey-text">
              The modern workforce management platform for forward-thinking service businesses.
            </div>
            <div className="social-logo-div-footer">
              {/* Instagram */}
              <a href="#" className="link-block w-inline-block">
                <div className="icon-embed-xsmall w-embed">
                  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden="true" role="img">
                    <path fillRule="evenodd" clipRule="evenodd" d="M16 3.24268H8C5.23858 3.24268 3 5.48126 3 8.24268V16.2427C3 19.0041 5.23858 21.2427 8 21.2427H16C18.7614 21.2427 21 19.0041 21 16.2427V8.24268C21 5.48126 18.7614 3.24268 16 3.24268ZM19.25 16.2427C19.2445 18.0353 17.7926 19.4872 16 19.4927H8C6.20735 19.4872 4.75549 18.0353 4.75 16.2427V8.24268C4.75549 6.45003 6.20735 4.99817 8 4.99268H16C17.7926 4.99817 19.2445 6.45003 19.25 8.24268V16.2427ZM16.75 8.49268C17.3023 8.49268 17.75 8.04496 17.75 7.49268C17.75 6.9404 17.3023 6.49268 16.75 6.49268C16.1977 6.49268 15.75 6.9404 15.75 7.49268C15.75 8.04496 16.1977 8.49268 16.75 8.49268ZM12 7.74268C9.51472 7.74268 7.5 9.7574 7.5 12.2427C7.5 14.728 9.51472 16.7427 12 16.7427C14.4853 16.7427 16.5 14.728 16.5 12.2427C16.5027 11.0484 16.0294 9.90225 15.1849 9.05776C14.3404 8.21327 13.1943 7.74002 12 7.74268ZM9.25 12.2427C9.25 13.7615 10.4812 14.9927 12 14.9927C13.5188 14.9927 14.75 13.7615 14.75 12.2427C14.75 10.7239 13.5188 9.49268 12 9.49268C10.4812 9.49268 9.25 10.7239 9.25 12.2427Z" fill="currentColor"></path>
                  </svg>
                </div>
              </a>
              {/* Facebook */}
              <a href="#" className="link-block w-inline-block">
                <div className="icon-embed-xsmall w-embed">
                  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden="true" role="img">
                    <path d="M22 12.3038C22 6.74719 17.5229 2.24268 12 2.24268C6.47715 2.24268 2 6.74719 2 12.3038C2 17.3255 5.65684 21.4879 10.4375 22.2427V15.2121H7.89844V12.3038H10.4375V10.0872C10.4375 7.56564 11.9305 6.1728 14.2146 6.1728C15.3088 6.1728 16.4531 6.36931 16.4531 6.36931V8.84529H15.1922C13.95 8.84529 13.5625 9.6209 13.5625 10.4166V12.3038H16.3359L15.8926 15.2121H13.5625V22.2427C18.3432 21.4879 22 17.3257 22 12.3038Z" fill="currentColor"></path>
                  </svg>
                </div>
              </a>
              {/* YouTube */}
              <a href="#" className="link-block w-inline-block">
                <div className="icon-embed-xsmall w-embed">
                  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden="true" role="img">
                    <path d="M21.5928 7.203C21.4789 6.7804 21.2563 6.395 20.9472 6.08517C20.6381 5.77533 20.2532 5.55186 19.8308 5.437C18.2648 5.007 11.9998 5 11.9998 5C11.9998 5 5.73584 4.993 4.16884 5.404C3.74677 5.52415 3.36266 5.75078 3.05341 6.06213C2.74415 6.37349 2.52013 6.75912 2.40284 7.182C1.98984 8.748 1.98584 11.996 1.98584 11.996C1.98584 11.996 1.98184 15.26 2.39184 16.81C2.62184 17.667 3.29684 18.344 4.15484 18.575C5.73684 19.005 11.9848 19.012 11.9848 19.012C11.9848 19.012 18.2498 19.019 19.8158 18.609C20.2383 18.4943 20.6236 18.2714 20.9335 17.9622C21.2434 17.653 21.4672 17.2682 21.5828 16.846C21.9968 15.281 21.9998 12.034 21.9998 12.034C21.9998 12.034 22.0198 8.769 21.5928 7.203ZM9.99584 15.005L10.0008 9.005L15.2078 12.01L9.99584 15.005Z" fill="currentColor"></path>
                  </svg>
                </div>
              </a>
              {/* X / Twitter */}
              <a href="#" className="link-block w-inline-block">
                <div className="icon-embed-xsmall w-embed">
                  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden="true" role="img">
                    <path d="M17.1761 4.24268H19.9362L13.9061 11.0201L21 20.2427H15.4456L11.0951 14.6493L6.11723 20.2427H3.35544L9.80517 12.9935L3 4.24268H8.69545L12.6279 9.3553L17.1761 4.24268ZM16.2073 18.6181H17.7368L7.86441 5.78196H6.2232L16.2073 18.6181Z" fill="currentColor"></path>
                  </svg>
                </div>
              </a>
            </div>
          </div>

          <div className="footer-grid-div-2">
            <div className="text-heading white-text-colour">Product<br /></div>
            <a href="#" className="footer-text-link">Features</a>
            <a href="#" className="footer-text-link">Pricing</a>
            <a href="#" className="footer-text-link">Integrations</a>
            <a href="#" className="footer-text-link">Update</a>
          </div>

          <div className="footer-grid-div-2">
            <div className="text-heading white-text-colour">Company<br /></div>
            <a href="#" className="footer-text-link">About Us</a>
            <a href="#" className="footer-text-link">Careers</a>
            <a href="#" className="footer-text-link">Blog</a>
            <a href="#" className="footer-text-link">Contact</a>
          </div>

          <div className="footer-grid-div-2">
            <div className="text-heading white-text-colour">Support<br /></div>
            <a href="#" className="footer-text-link">Help Center</a>
            <a href="#" className="footer-text-link">API Docs</a>
            <a href="#" className="footer-text-link">Status</a>
          </div>
        </div>

        <div className="bttm-footer-div">
          <div>© 2024 MaboCore Inc. All rights reserved.</div>
          <div className="bttm-footer-right-div">
            <a href="#" className="footer-text-link">Privacy Policy</a>
            <a href="#" className="footer-text-link">Terms of Service</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;