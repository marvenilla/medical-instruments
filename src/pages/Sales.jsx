import PageNav from "../components/PageNav";
import OrderList from '../components/OrderList';
import styles from './Sales.module.css';

export default function Sale() {
  return (
    <div>
      <PageNav />
      <div className={styles['sales-order-container']}>
        <h1>Your Sales Orders</h1>
        <OrderList />
      </div>
    </div>
  );
}