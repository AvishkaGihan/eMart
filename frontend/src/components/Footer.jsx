import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <Container>
        <Row className="gy-4">
          <Col md={4}>
            <h4 style={{ color: '#ffffff', fontWeight: 'bold' }}>eMart</h4>
            <p>Your one-stop destination for premium products. We offer the best quality at the most competitive prices.</p>
          </Col>
          <Col md={2}>
            <h5>Shop</h5>
            <ul className="footer-links">
              <li><Link to="/">All Products</Link></li>
              <li><Link to="/">Latest Arrivals</Link></li>
              <li><Link to="/">Weekly Deals</Link></li>
            </ul>
          </Col>
          <Col md={2}>
            <h5>Support</h5>
            <ul className="footer-links">
              <li><Link to="/">Contact Us</Link></li>
              <li><Link to="/">FAQs</Link></li>
              <li><Link to="/">Shipping Policy</Link></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Company</h5>
            <ul className="footer-links">
              <li><Link to="/">About eMart</Link></li>
              <li><Link to="/">Careers</Link></li>
              <li><Link to="/">Privacy Policy</Link></li>
            </ul>
          </Col>
        </Row>
        <Row>
          <Col className="footer-bottom">
            <p>eMart &copy; {currentYear}. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
