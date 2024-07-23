import { NavLink } from "react-router-dom";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import Logo from "./Logo";
import styles from "./PageNav.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

function PageNav() {
  return (
    <Navbar expand="lg" className={styles.nav}>
      <Logo />
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className={`ml-auto ${styles.navLinks}`}>
          <Nav.Link as={NavLink} to="/home" className={styles.navLink}>
            Home
          </Nav.Link>
          <NavDropdown
            title="Sales Order"
            id="sales-nav-dropdown"
            className={styles.navLink}
          >
            <NavDropdown.Item
              as={NavLink}
              to="/sales"
              className={styles.dropdownItem}
            >
              Sales
            </NavDropdown.Item>

            <NavDropdown.Item
              as={NavLink}
              to="/work-order"
              className={styles.dropdownItem}
            >
              Work Orders
            </NavDropdown.Item>

            <NavDropdown.Item
              as={NavLink}
              to="/inventory"
              className={styles.dropdownItem}
            >
              Inventory
            </NavDropdown.Item>

            <NavDropdown.Item
              as={NavLink}
              to="/production"
              className={styles.dropdownItem}
            >
              Production Plan
            </NavDropdown.Item>

            <NavDropdown.Item
              as={NavLink}
              to="/production"
              className={styles.dropdownItem}
            >
              Operations Plan
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown
            title="Inventory
"
            id="inventory-nav-dropdown"
            className={styles.navLink}
          >
            <NavDropdown.Item
              as={NavLink}
              to="/inventory"
              className={styles.dropdownItem}
            >
              Current inventory
            </NavDropdown.Item>

            <NavDropdown.Item
              as={NavLink}
              to="/tracking"
              className={styles.dropdownItem}
            >
              Sales orders
            </NavDropdown.Item>

            <NavDropdown.Item
              as={NavLink}
              to="/tracking"
              className={styles.dropdownItem}
            >
              Purchase orders
            </NavDropdown.Item>

            <NavDropdown.Item
              as={NavLink}
              to="/tracking"
              className={styles.dropdownItem}
            >
              MRP planning
            </NavDropdown.Item>

            <NavDropdown.Item
              as={NavLink}
              to="/tracking"
              className={styles.dropdownItem}
            >
              Shelf life
            </NavDropdown.Item>

            <NavDropdown.Item
              as={NavLink}
              to="/tracking"
              className={styles.dropdownItem}
            >
              Costs
            </NavDropdown.Item>

            <NavDropdown.Item
              as={NavLink}
              to="/tracking"
              className={styles.dropdownItem}
            >
              Inventory product line
            </NavDropdown.Item>
          </NavDropdown>

          <NavDropdown
            title="Shipping"
            id="shipping-nav-dropdown"
            className={styles.navLink}
          >
            <NavDropdown.Item
              as={NavLink}
              to="/work-order"
              className={styles.dropdownItem}
            >
              Daily dashboard
            </NavDropdown.Item>
            <NavDropdown.Item
              as={NavLink}
              to="/inventory"
              className={styles.dropdownItem}
            >
              Sales orders
            </NavDropdown.Item>
          </NavDropdown>

          <NavDropdown
            title="Operational plan"
            id="shipping-nav-dropdown"
            className={styles.navLink}
          >
            <NavDropdown.Item
              as={NavLink}
              to="/work-order"
              className={styles.dropdownItem}
            >
              Work orders
            </NavDropdown.Item>
            <NavDropdown.Item
              as={NavLink}
              to="/inventory"
              className={styles.dropdownItem}
            >
              Purchasing
            </NavDropdown.Item>

            <NavDropdown.Item
              as={NavLink}
              to="/inventory"
              className={styles.dropdownItem}
            >
              Incoming
            </NavDropdown.Item>

            <NavDropdown.Item
              as={NavLink}
              to="/work-order"
              className={styles.dropdownItem}
            >
              Quality
            </NavDropdown.Item>
            <NavDropdown.Item
              as={NavLink}
              to="/inventory"
              className={styles.dropdownItem}
            >
              Kitting
            </NavDropdown.Item>

            <NavDropdown.Item
              as={NavLink}
              to="/inventory"
              className={styles.dropdownItem}
            >
              Production
            </NavDropdown.Item>
          </NavDropdown>

          <NavDropdown
            title="Production plan"
            id="shipping-nav-dropdown"
            className={styles.navLink}
          >
            <NavDropdown.Item
              as={NavLink}
              to="/work-order"
              className={styles.dropdownItem}
            >
              Work order
            </NavDropdown.Item>
            <NavDropdown.Item
              as={NavLink}
              to="/inventory"
              className={styles.dropdownItem}
            >
              Dates
            </NavDropdown.Item>

            <NavDropdown.Item
              as={NavLink}
              to="/work-order"
              className={styles.dropdownItem}
            >
              Qtys
            </NavDropdown.Item>
            <NavDropdown.Item
              as={NavLink}
              to="/inventory"
              className={styles.dropdownItem}
            >
              Efficiencies
            </NavDropdown.Item>
          </NavDropdown>

          <Nav.Link
            as={NavLink}
            to="/login"
            className={`${styles.navLink} ${styles.ctaLink}`}
          >
            Login
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default PageNav;
