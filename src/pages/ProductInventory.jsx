import { useState, useEffect } from 'react';
import './ProductInventory.css';
import PageNav from '../components/PageNav';

const ProductInventory = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({ id: null, name: '', quantity: '', price: '', uom: 'Each', category: 'Finished Good', storeRoom: '', location: '', lotNumber: '' });
  const [editIndex, setEditIndex] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterId, setFilterId] = useState('');

  useEffect(() => {
    // Load products from local storage when the component mounts
    const savedProducts = localStorage.getItem('products');
    console.log('Raw products from localStorage:', savedProducts);
    if (savedProducts && savedProducts !== '[]') {
      try {
        const parsedProducts = JSON.parse(savedProducts);
        if (Array.isArray(parsedProducts)) {
          setProducts(parsedProducts);
          console.log('Loaded products from localStorage:', parsedProducts);
        } else {
          console.error('Parsed products is not an array:', parsedProducts);
        }
      } catch (error) {
        console.error('Error parsing products from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Save products to local storage whenever the products array changes
    localStorage.setItem('products', JSON.stringify(products));
    console.log('Products saved to localStorage:', products);
  }, [products]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({ ...currentProduct, [name]: value });
  };

  const handleAddProduct = () => {
    const newProduct = {
      ...currentProduct,
      id: Math.floor(Math.random() * 1000000) // Generate a random number for ID
    };
    setProducts([...products, newProduct]);
    setCurrentProduct({ id: null, name: '', quantity: '', price: '', uom: 'Each', category: 'Finished Good', storeRoom: '', location: '', lotNumber: '' });
  };

  const handleSaveProduct = () => {
    const updatedProducts = products.map((product, index) =>
      index === editIndex ? currentProduct : product
    );
    setProducts(updatedProducts);
    setShowModal(false);
    setCurrentProduct({ id: null, name: '', quantity: '', price: '', uom: 'Each', category: 'Finished Good', storeRoom: '', location: '', lotNumber: '' });
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

  const filteredProducts = products.filter(product => {
    return (filterCategory === '' || product.category === filterCategory) &&
           (filterId === '' || product.id === parseInt(filterId));
  });

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

        <div className="form-group">
          <label className='product-label'>Category</label>
          <select className='product-input'
            name="category"
            value={currentProduct.category}
            onChange={handleInputChange}
          >
            <option value="Finished Good">Finished Good</option>
            <option value="Raw Material">Raw Material</option>
          </select>
        </div>

        <div className="form-group">
          <label className='product-label'>Store Room</label>
          <input className='product-input'
            type="text"
            name="storeRoom"
            value={currentProduct.storeRoom}
            onChange={handleInputChange}
            placeholder="Enter store room"
          />
        </div>

        <div className="form-group">
          <label className='product-label'>Location</label>
          <input className='product-input'
            type="text"
            name="location"
            value={currentProduct.location}
            onChange={handleInputChange}
            placeholder="Enter location"
          />
        </div>

        <div className="form-group">
          <label className='product-label'>Lot Number</label>
          <input className='product-input'
            type="text"
            name="lotNumber"
            value={currentProduct.lotNumber}
            onChange={handleInputChange}
            placeholder="Enter lot number"
          />
        </div>

        <button onClick={handleAddProduct}>Add Product</button>
      </div>

      <div className="list-container">
        <h2>Product List</h2>

        <div className="filters">
          <label>Filter by Category:</label>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="">All</option>
            <option value="Finished Good">Finished Good</option>
            <option value="Raw Material">Raw Material</option>
          </select>

          <label>Filter by ID:</label>
          <input
            type="text"
            value={filterId}
            onChange={(e) => setFilterId(e.target.value)}
            placeholder="Enter product ID"
          />
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Unit of Measure</th>
              <th>Category</th>
              <th>Store Room</th>
              <th>Location</th>
              <th>Lot Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {filteredProducts.map((product, index) => (
              <tr key={index}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>{product.price}</td>
                <td>{product.uom}</td>
                <td>{product.category}</td>
                <td>{product.storeRoom}</td>
                <td>{product.location}</td>
                <td>{product.lotNumber}</td>
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

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={currentProduct.category}
              onChange={handleInputChange}
            >
              <option value="Finished Good">Finished Good</option>
              <option value="Raw Material">Raw Material</option>
            </select>
          </div>

          <div className="form-group">
            <label>Store Room</label>
            <input
              type="text"
              name="storeRoom"
              value={currentProduct.storeRoom}
              onChange={handleInputChange}
              placeholder="Enter store room"
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={currentProduct.location}
              onChange={handleInputChange}
              placeholder="Enter location"
            />
          </div>

          <div className="form-group">
            <label>Lot Number</label>
            <input
              type="text"
              name="lotNumber"
              value={currentProduct.lotNumber}
              onChange={handleInputChange}
              placeholder="Enter lot number"
            />
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
