const WHATSAPP_BASE = "https://wa.me/919995206988";
const INSTAGRAM_URL =
  "https://www.instagram.com/_sai__yara_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";

const Contact = () => (
  <section className="home-about">
    <p className="eyebrow">Contact us</p>
    <h1 className="home-about__title contact-title">
      We are here to help
    </h1>
    <p className="contact-intro">
      As a growing company, we’re committed to delivering outstanding customer
      service at every step. We’re always here to help—if you have any questions
      or need assistance, don’t hesitate to get in touch.
    </p>
    <div
      className="home-about__text contact-cards"
    >
      <div className="contact-card">
        <p className="contact-card__title">WhatsApp Customer Care</p>
        <p className="contact-card__text">
          Reach us on WhatsApp for quick assistance:{" "}
          <a href={WHATSAPP_BASE} target="_blank" rel="noreferrer">
            <strong>+91 9995206988</strong>
          </a>{" "}
          (WhatsApp only).
        </p>
        <p className="contact-card__meta">Timings: 11am to 4pm</p>
      </div>

      <div className="contact-card">
        <p className="contact-card__title">Customer Support Email</p>
        <p className="contact-card__text">
          In case you are not able to reach us on our customer care number,
          please write to us at{" "}
          <a href="mailto: jewelssaiyara@gmail.com">
            {" "}
            <strong> jewelssaiyara@gmail.com</strong>
          </a>
          .
        </p>
        <p className="contact-card__meta">
          Our team will get back to you within 24-48 working hours.
        </p>
      </div>

      <div className="contact-card">
        <p className="contact-card__title">Customer Feedback &amp; Review</p>
        <p className="contact-card__text">
          Liked our products? Do share a review over DM on Instagram{" "}
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
            <strong>@_sai__yara_</strong>
          </a>
          .
        </p>
      </div>
    </div>
  </section>
);

export default Contact;
