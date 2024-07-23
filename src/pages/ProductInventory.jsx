import { useState } from 'react';
import './ProductInventory.css';
import PageNav from '../components/PageNav';

const ProductInventory = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({ name: '', quantity: '', price: '', uom: 'Each' });
  const [editIndex, setEditIndex] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({ ...currentProduct, [name]: value });
  };

  const handleAddProduct = () => {
    setProducts([...products, currentProduct]);
    setCurrentProduct({ name: '', quantity: '', price: '', uom: 'Each' });
  };

  const handleSaveProduct = () => {
    const updatedProducts = products.map((product, index) =>
      index === editIndex ? currentProduct : product
    );
    setProducts(updatedProducts);
    setShowModal(false);
    setCurrentProduct({ name: '', quantity: '', price: '' });
    setEditIndex(null);
  };

  const handleEditProduct = (index) => {
    setCurrentProduct(products[index]);
    setEditIndex(index);
    setShowModal(true);
  };

  const handleDeleteProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  return (
    <div className="container">
      <PageNav />
      <div className="header">
        <h1>Inventory</h1>
      </div>

      <div className="form-container">
        <div className="form-group">
          <label className='product-label'>Name</label>
          <input className='product-input'
            type="text"
            name="name"
            value={currentProduct.name}
            onChange={handleInputChange}
            placeholder="Enter product name"
          />
        </div>

        <div className="form-group">
          <label className='product-label'>Quantity</label>
          <input className='product-input'
            type="number"
            name="quantity"
            value={currentProduct.quantity}
            onChange={handleInputChange}
            placeholder="Enter quantity"
          />
        </div>

        <div className="form-group">
          <label className='product-label'>Price</label>
          <input className='product-input'
            type="number"
            name="price"
            value={currentProduct.price}
            onChange={handleInputChange}
            placeholder="Enter price"
          />
        </div>

        <div className="form-group">
          <label className='product-label'>Unit of Measure</label>
          <select className='product-input'
            name="uom"
            value={currentProduct.uom}
            onChange={handleInputChange}
          >
            <option value="Each">Each</option>
            <option value="Box">Box</option>
            <option value="Case">Case</option>
          </select>
        </div>

        <button onClick={handleAddProduct}>Add Product</button>
      </div>

      <div className="list-container">
        <h2>Product List</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Unit of Measure</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>{product.price}</td>
                <td>{product.uom}</td>
                <td>
                  <button onClick={() => handleEditProduct(index)}>Edit</button>
                  <button onClick={() => handleDeleteProduct(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={`modal ${showModal ? 'show' : ''}`}>
        <div className="modal-header">
          <h4>Edit Product</h4>
          <span className="close" onClick={() => setShowModal(false)}>&times;</span>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={currentProduct.name}
              onChange={handleInputChange}
              placeholder="Enter product name"
            />
          </div>

          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={currentProduct.quantity}
              onChange={handleInputChange}
              placeholder="Enter quantity"
            />
          </div>

          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={currentProduct.price}
              onChange={handleInputChange}
              placeholder="Enter price"
            />
          </div>

          <div className="form-group">
            <label>Unit of Measure</label>
            <select
              name="uom"
              value={currentProduct.uom}
              onChange={handleInputChange}
            >
              <option value="Each">Each</option>
              <option value="Box">Box</option>
              <option value="Case">Case</option>
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={() => setShowModal(false)}>Close</button>
          <button onClick={handleSaveProduct}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default ProductInventory;
